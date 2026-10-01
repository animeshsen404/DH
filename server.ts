import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase, getDatabase, saveDatabase } from './server/db.js';
import { requireAuth, requireRole, generateToken, verifyCredentials, hashPassword, type AuthenticatedRequest } from './server/auth.js';
import { dispatchNotification } from './server/email.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

// Initialize persistent database
initDatabase();

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory for custom website and gallery images
const UPLOADS_DIR = path.resolve(__dirname, 'data/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple in-memory rate limiter for public forms
const ipRateLimits = new Map<string, { count: number; resetTime: number }>();
function rateLimit(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: () => void) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const clientRecord = ipRateLimits.get(ip);

    if (!clientRecord || now > clientRecord.resetTime) {
      ipRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (clientRecord.count >= limit) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a few moments before trying again.'
      });
    }

    clientRecord.count += 1;
    next();
  };
}

// ----------------------------------------------------
// PUBLIC API ENDPOINTS
// ----------------------------------------------------

// Full initial public bundle
app.get('/api/public/data', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    services: db.services,
    portfolio: db.portfolio,
    blog: db.blog.filter(p => p.isPublished),
    testimonials: db.testimonials,
    faqs: db.faqs,
    careers: db.careers.filter(c => c.isOpen),
    gallery: db.gallery || [],
    settings: {
      companyName: db.settings.companyName,
      tagline: db.settings.tagline,
      phone: db.settings.phone,
      email: db.settings.email,
      headOfficeAddress: db.settings.headOfficeAddress,
      branchOfficeAddress: db.settings.branchOfficeAddress,
      hours: db.settings.hours,
      facebookUrl: db.settings.facebookUrl,
      instagramUrl: db.settings.instagramUrl,
      linkedinUrl: db.settings.linkedinUrl,
      twitterUrl: db.settings.twitterUrl
    },
    pagesMeta: db.pagesMeta
  });
});

// Submit Enquiry / Contact Quote with spam honeypot
app.post('/api/public/enquiry', rateLimit(8, 60000), async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, serviceInterest, budget, timeline, message, honeypot } = req.body;

    // Silent honeypot spam protection
    if (honeypot && String(honeypot).trim() !== '') {
      console.warn('[Spam Detected] Honeypot triggered by:', req.ip);
      return res.status(200).json({ success: true, message: 'Enquiry received successfully.' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and project message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const db = getDatabase();
    const newEnquiry = {
      id: `enq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      company: String(company || '').trim(),
      serviceInterest: String(serviceInterest || 'General Consultation').trim(),
      budget: String(budget || 'Undisclosed').trim(),
      timeline: String(timeline || 'Flexible').trim(),
      message: String(message).trim(),
      status: 'new' as const,
      submittedAt: new Date().toISOString()
    };

    db.enquiries.unshift(newEnquiry);
    saveDatabase(db);

    // Dispatch notification
    const dispatchResult = await dispatchNotification({
      type: 'enquiry',
      subject: `New Lead: ${newEnquiry.name} (${newEnquiry.serviceInterest})`,
      recipient: db.settings.notifyEmail || 'digitalhashtagllp@gmail.com',
      body: `New enquiry received from ${newEnquiry.name} (${newEnquiry.email}, Phone: ${newEnquiry.phone}).\nService: ${newEnquiry.serviceInterest}\nBudget: ${newEnquiry.budget}\nMessage: ${newEnquiry.message}`,
      data: newEnquiry
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been received. Our strategy team will respond within 24 business hours.',
      notificationStatus: dispatchResult.mode
    });
  } catch (err: any) {
    console.error('Enquiry submission error:', err);
    res.status(500).json({ error: 'Failed to process inquiry. Please try again or call us directly.' });
  }
});

// Submit Job Application with spam honeypot
app.post('/api/public/application', rateLimit(5, 60000), async (req: Request, res: Response) => {
  try {
    const { jobId, jobTitle, applicantName, email, phone, linkedin, portfolioUrl, resumeText, coverLetter, honeypot } = req.body;

    if (honeypot && String(honeypot).trim() !== '') {
      return res.status(200).json({ success: true, message: 'Application submitted successfully.' });
    }

    if (!jobId || !applicantName || !email || !resumeText) {
      return res.status(400).json({ error: 'Name, email, job ID, and resume details are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const db = getDatabase();
    const newApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      jobId: String(jobId),
      jobTitle: String(jobTitle || 'General Application'),
      applicantName: String(applicantName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      linkedin: String(linkedin || '').trim(),
      portfolioUrl: String(portfolioUrl || '').trim(),
      resumeText: String(resumeText).trim(),
      coverLetter: String(coverLetter || '').trim(),
      status: 'new' as const,
      submittedAt: new Date().toISOString()
    };

    db.applications.unshift(newApplication);
    saveDatabase(db);

    await dispatchNotification({
      type: 'application',
      subject: `New Career Application: ${newApplication.applicantName} for ${newApplication.jobTitle}`,
      recipient: db.settings.notifyEmail || 'digitalhashtagllp@gmail.com',
      body: `Candidate ${newApplication.applicantName} applied for ${newApplication.jobTitle}.\nEmail: ${newApplication.email}\nPhone: ${newApplication.phone}\nResume excerpt:\n${newApplication.resumeText.slice(0, 300)}...`,
      data: newApplication
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Our talent team will review your application.'
    });
  } catch (err: any) {
    console.error('Application submission error:', err);
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
});

// ----------------------------------------------------
// AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = verifyCredentials(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    }
  });
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// ----------------------------------------------------
// ADMIN PROTECTED MANAGEMENT ENDPOINTS
// ----------------------------------------------------

// Admin Full Data Fetch
app.get('/api/admin/overview', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({
    stats: {
      totalEnquiries: db.enquiries.length,
      newEnquiries: db.enquiries.filter(e => e.status === 'new').length,
      totalApplications: db.applications.length,
      newApplications: db.applications.filter(a => a.status === 'new').length,
      totalBlogPosts: db.blog.length,
      publishedBlogPosts: db.blog.filter(b => b.isPublished).length,
      totalServices: db.services.length,
      totalPortfolioItems: db.portfolio.length,
      totalGalleryPhotos: (db.gallery || []).length,
      activeCareers: db.careers.filter(c => c.isOpen).length
    },
    enquiries: db.enquiries,
    applications: db.applications,
    services: db.services,
    portfolio: db.portfolio,
    blog: db.blog,
    testimonials: db.testimonials,
    faqs: db.faqs,
    careers: db.careers,
    gallery: db.gallery || [],
    pagesMeta: db.pagesMeta,
    settings: db.settings,
    notificationsLog: db.notificationsLog
  });
});

// Enquiries Status Update & Notes
app.patch('/api/admin/enquiries/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const db = getDatabase();
  const enquiry = db.enquiries.find(e => e.id === id);

  if (!enquiry) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  if (status) enquiry.status = status;
  if (notes !== undefined) enquiry.notes = notes;
  saveDatabase(db);

  res.json({ success: true, enquiry });
});

app.delete('/api/admin/enquiries/:id', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.enquiries = db.enquiries.filter(e => e.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Applications Status Update
app.patch('/api/admin/applications/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDatabase();
  const application = db.applications.find(a => a.id === id);

  if (!application) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  if (status) application.status = status;
  saveDatabase(db);

  res.json({ success: true, application });
});

app.delete('/api/admin/applications/:id', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.applications = db.applications.filter(a => a.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Blog CRUD
app.post('/api/admin/blog', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const newPost = {
    ...req.body,
    id: `post-${Date.now()}`,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    publishedAt: req.body.publishedAt || new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  db.blog.unshift(newPost);
  saveDatabase(db);
  res.status(201).json({ success: true, post: newPost });
});

app.put('/api/admin/blog/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.blog.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Post not found.' });

  db.blog[index] = {
    ...db.blog[index],
    ...req.body,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  saveDatabase(db);
  res.json({ success: true, post: db.blog[index] });
});

app.delete('/api/admin/blog/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.blog = db.blog.filter(b => b.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Services CRUD
app.post('/api/admin/services', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const newService = {
    ...req.body,
    id: `srv-${Date.now()}`
  };
  db.services.push(newService);
  saveDatabase(db);
  res.status(201).json({ success: true, service: newService });
});

app.put('/api/admin/services/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.services.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Service not found.' });

  db.services[index] = { ...db.services[index], ...req.body };
  saveDatabase(db);
  res.json({ success: true, service: db.services[index] });
});

app.delete('/api/admin/services/:id', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.services = db.services.filter(s => s.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Portfolio CRUD
app.post('/api/admin/portfolio', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const newItem = {
    ...req.body,
    id: `port-${Date.now()}`
  };
  db.portfolio.push(newItem);
  saveDatabase(db);
  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/admin/portfolio/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = db.portfolio.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Portfolio item not found.' });

  db.portfolio[index] = { ...db.portfolio[index], ...req.body };
  saveDatabase(db);
  res.json({ success: true, item: db.portfolio[index] });
});

app.delete('/api/admin/portfolio/:id', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.portfolio = db.portfolio.filter(p => p.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Testimonials CRUD
app.post('/api/admin/testimonials', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const newTestimonial = { ...req.body, id: `test-${Date.now()}` };
  db.testimonials.push(newTestimonial);
  saveDatabase(db);
  res.status(201).json({ success: true, testimonial: newTestimonial });
});

app.put('/api/admin/testimonials/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const idx = db.testimonials.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found.' });
  db.testimonials[idx] = { ...db.testimonials[idx], ...req.body };
  saveDatabase(db);
  res.json({ success: true, testimonial: db.testimonials[idx] });
});

app.delete('/api/admin/testimonials/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.testimonials = db.testimonials.filter(t => t.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Careers CRUD
app.post('/api/admin/careers', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const newJob = {
    ...req.body,
    id: `job-${Date.now()}`,
    postedAt: new Date().toISOString().split('T')[0]
  };
  db.careers.push(newJob);
  saveDatabase(db);
  res.status(201).json({ success: true, job: newJob });
});

app.put('/api/admin/careers/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const idx = db.careers.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Job not found.' });
  db.careers[idx] = { ...db.careers[idx], ...req.body };
  saveDatabase(db);
  res.json({ success: true, job: db.careers[idx] });
});

app.delete('/api/admin/careers/:id', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.careers = db.careers.filter(c => c.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// FAQs CRUD
app.post('/api/admin/faqs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const newFaq = { ...req.body, id: `faq-${Date.now()}` };
  db.faqs.push(newFaq);
  saveDatabase(db);
  res.status(201).json({ success: true, faq: newFaq });
});

app.put('/api/admin/faqs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const idx = db.faqs.findIndex(f => f.id === id);
  if (idx === -1) return res.status(404).json({ error: 'FAQ not found.' });
  db.faqs[idx] = { ...db.faqs[idx], ...req.body };
  saveDatabase(db);
  res.json({ success: true, faq: db.faqs[idx] });
});

app.delete('/api/admin/faqs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  db.faqs = db.faqs.filter(f => f.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Gallery CRUD
app.post('/api/admin/gallery', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const newItem = {
    ...req.body,
    id: `gal-${Date.now()}`,
    createdAt: req.body.createdAt || new Date().toISOString().split('T')[0]
  };
  if (!db.gallery) db.gallery = [];
  db.gallery.unshift(newItem);
  saveDatabase(db);
  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/admin/gallery/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  if (!db.gallery) db.gallery = [];
  const idx = db.gallery.findIndex(g => g.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Gallery photo not found.' });
  db.gallery[idx] = { ...db.gallery[idx], ...req.body };
  saveDatabase(db);
  res.json({ success: true, item: db.gallery[idx] });
});

app.delete('/api/admin/gallery/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  if (!db.gallery) db.gallery = [];
  db.gallery = db.gallery.filter(g => g.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Image Upload Endpoint (handles Base64 images directly into data/uploads/)
app.post('/api/admin/upload-image', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'Image data or URL is required.' });
    }

    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/uploads/') || dataUrl.startsWith('/src/')) {
      return res.json({ success: true, url: dataUrl });
    }

    const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (match) {
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const safeName = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_') : `upload_${Date.now()}`) + '.' + ext;
      const filePath = path.join(UPLOADS_DIR, safeName);
      fs.writeFileSync(filePath, buffer);
      return res.json({ success: true, url: `/uploads/${safeName}` });
    }

    return res.status(400).json({ error: 'Unsupported image format. Provide a valid image URL or base64 data.' });
  } catch (err: any) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to process image: ' + err.message });
  }
});

// Website Key Images Management
app.get('/api/admin/website-images', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.json({
    images: db.settings.websiteImages || {
      heroBannerImage: '/src/assets/images/hero_creative_agency_1790755973218.jpg',
      aboutTeamImage: '/src/assets/images/agency_team_collaboration_1790755997686.jpg',
      officeWorkspaceImage: '/src/assets/images/office_workspace_loft_1790756025261.jpg',
      portfolioBannerImage: '/src/assets/images/portfolio_web_showcase_1790756013525.jpg'
    }
  });
});

app.put('/api/admin/website-images', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  if (!db.settings.websiteImages) {
    db.settings.websiteImages = {};
  }
  db.settings.websiteImages = {
    ...db.settings.websiteImages,
    ...req.body
  };
  saveDatabase(db);
  res.json({ success: true, images: db.settings.websiteImages });
});

// Change Admin Login Credentials
app.post('/api/admin/change-credentials', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newEmail, newName, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to verify your identity.' });
    }

    const currentUserId = req.user?.id;
    const db = getDatabase();
    const userIndex = db.users.findIndex(u => u.id === currentUserId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const currentUser = db.users[userIndex];

    const verifiedUser = verifyCredentials(currentUser.email, currentPassword);
    if (!verifiedUser) {
      return res.status(401).json({ error: 'Incorrect current password. Please try again.' });
    }

    if (newEmail && newEmail.toLowerCase().trim() !== currentUser.email.toLowerCase()) {
      const existing = db.users.find(u => u.id !== currentUser.id && u.email.toLowerCase() === newEmail.toLowerCase().trim());
      if (existing) {
        return res.status(400).json({ error: 'This email is already in use by another account.' });
      }
      currentUser.email = newEmail.toLowerCase().trim();
    }

    if (newName && newName.trim()) {
      currentUser.name = newName.trim();
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters.' });
      }
      currentUser.passwordHash = hashPassword(newPassword);
      currentUser.isDefaultPassword = false;
    }

    db.users[userIndex] = currentUser;
    saveDatabase(db);

    const token = generateToken(currentUser);
    res.json({
      success: true,
      message: 'Admin credentials successfully updated! Your new credentials are now active.',
      token,
      user: {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
        isDefaultPassword: false
      }
    });
  } catch (err: any) {
    console.error('Error changing credentials:', err);
    res.status(500).json({ error: 'Server error while updating credentials: ' + err.message });
  }
});

// SEO & Metadata update
app.put('/api/admin/meta/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const idx = db.pagesMeta.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Meta not found.' });
  db.pagesMeta[idx] = { ...db.pagesMeta[idx], ...req.body };
  saveDatabase(db);
  res.json({ success: true, meta: db.pagesMeta[idx] });
});

// Settings update
app.put('/api/admin/settings', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// Database Export & Backup
app.get('/api/admin/backup', requireAuth, requireRole(['admin']), (_req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=digitalhashtag-backup-${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(db, null, 2));
});

// Database Restore
app.post('/api/admin/restore', requireAuth, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const incomingData = req.body;
    if (!incomingData || !incomingData.services || !incomingData.settings) {
      return res.status(400).json({ error: 'Invalid database backup structure.' });
    }
    saveDatabase(incomingData);
    res.json({ success: true, message: 'Database successfully restored from backup.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to restore database: ' + err.message });
  }
});

// ----------------------------------------------------
// SEO: SITEMAP & ROBOTS.TXT
// ----------------------------------------------------

app.get('/robots.txt', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://digitalhashtag.in';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`);
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://digitalhashtag.in';
  const db = getDatabase();
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services', priority: '0.9', changefreq: 'weekly' },
    { loc: '/portfolio', priority: '0.9', changefreq: 'weekly' },
    { loc: '/gallery', priority: '0.8', changefreq: 'weekly' },
    { loc: '/testimonials', priority: '0.7', changefreq: 'monthly' },
    { loc: '/blog', priority: '0.8', changefreq: 'daily' },
    { loc: '/careers', priority: '0.7', changefreq: 'weekly' },
    { loc: '/contact', priority: '0.9', changefreq: 'monthly' },
    { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' }
  ];

  const serviceUrls = db.services.map(s => ({
    loc: `/services/${s.slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const portfolioUrls = db.portfolio.map(p => ({
    loc: `/portfolio/${p.slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  const blogUrls = db.blog.filter(b => b.isPublished).map(b => ({
    loc: `/blog/${b.slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  const allUrls = [...staticUrls, ...serviceUrls, ...portfolioUrls, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// ----------------------------------------------------
// FRONTEND SERVING (Vite Middleware in Dev, Static in Prod)
// ----------------------------------------------------

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Digital Hashtag full-stack application running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server Error] Failed to start server:', err);
  process.exit(1);
});
