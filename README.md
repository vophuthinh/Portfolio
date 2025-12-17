# 🚀 AI Engineer Portfolio Website

> A modern, responsive portfolio website showcasing AI/ML engineering projects, certifications, and skills with smooth animations and professional design.

**Live Demo**: [vophuthinh.com](https://vophuthinh.com)

---

## ✨ Features

### 🎨 **UI/UX Design**
- **Dynamic Typing Animation**: Showcases multiple roles (AI Engineer, ML Engineer, LLM Application Engineer, MLOps Practitioner)
- **Smooth Animations**: AOS (Animate On Scroll) integration for engaging user experience
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **Theme Switcher**: 5 color themes + light/dark mode toggle
- **Modern Card Design**: Premium project cards with hover effects and impact metrics
- **Enhanced Certifications**: Beautiful certificate cards with award differentiation
- **Interest Gallery**: Interactive image galleries for personal interests

### 🛠️ **Technical Features**
- **Modular Architecture**: Separated data, config, and logic for easy maintenance
- **Security**: Content Security Policy (CSP) implementation
- **Performance**: Lazy loading images, deferred scripts, optimized assets, WebP support
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, Schema.org markup
- **Performance Monitoring**: Core Web Vitals tracking (FCP, LCP, FID, CLS)
- **Image Optimization**: Automatic WebP detection and responsive images

### 📧 **Contact Form**
- Email validation with regex
- EmailJS integration for direct email sending
- SweetAlert2 for beautiful success/error messages
- Fallback to mailto: if EmailJS fails

### 🎯 **Project Showcase**
- Filterable project grid (LLM, Computer Vision, MLOps, Data Analytics)
- Interactive project cards with:
  - **GitHub Button** - View source code (black theme with icon)
  - **Live Demo Button** - Try the project (gradient with pulse animation)
  - Tech stack chips with hover effects
  - Impact metrics (quantifiable results)
  - Case study modals with detailed information
  - "Coming Soon" badges for work-in-progress
- Loading states and error handling

### 🏆 **Certifications & Awards**
- Beautiful certificate cards with gradient effects
- Award cards with special golden styling and animations
- Click-to-zoom certificate images
- Organized by type (Certificate/Award)

---

## 🛠️ Technologies Used

### **Frontend**
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, Animations
- **JavaScript (ES6+)**: Vanilla JS, no frameworks

### **Libraries**
- **Typed.js**: Typing animation
- **AOS**: Scroll animations
- **EmailJS**: Email functionality
- **SweetAlert2**: Beautiful alerts
- **Font Awesome**: Icons
- **Devicon**: Tech stack icons

### **Development Tools**
- **EditorConfig**: Consistent code formatting
- **Git**: Version control
- **Modular JS**: Config-driven architecture

---

## 📁 File Structure

```
Portfolio/
│
├── index.html                    # Main HTML file with semantic structure
├── README.md                     # Documentation
├── offline.html                  # Offline fallback page
├── package.json                  # NPM scripts and metadata
├── .editorconfig                 # Editor configuration
│
├── js/                           # JavaScript files
│   ├── config.js                 # Global configuration & Logger utility
│   ├── projects-data.js          # Project data (separated for easy updates)
│   ├── image-optimizer.js        # WebP detection & lazy loading
│   ├── performance-monitor.js   # Core Web Vitals tracking
│   ├── script.js                 # Main application logic
│   └── style-switcher.js         # Theme switcher functionality
│
└── assets/
    ├── css/                      # Stylesheets
    │   ├── style.css             # Main styles
    │   ├── style-switcher.css    # Theme switcher styles
    │   └── skins/                # Color theme variants
    │       ├── color-1.css       # Default theme
    │       ├── color-2.css       # Alternative theme 2
    │       ├── color-3.css       # Alternative theme 3
    │       ├── color-4.css       # Alternative theme 4
    │       └── color-5.css       # Alternative theme 5
    │
    ├── images/                   # Image assets
    │   ├── hero.png              # Hero section image
    │   ├── portfolio/            # Project screenshots
    │   ├── certifications/       # Certificate images
    │   └── interests/            # Interest gallery images
    │
    ├── favicon/                  # Favicon files (all sizes)
    └── CV.pdf                    # Downloadable resume
```

---

## 🎨 Architecture & Design Patterns

### **Configuration-Driven**
- Centralized config in `config.js`
- Easy to update without touching core logic
- Environment-aware logging

### **Data Separation**
- Projects stored in `projects-data.js`
- Add/edit projects without modifying JS logic
- Type-safe data structure

### **Modular CSS**
- CSS variables for theming
- Component-based organization
- Responsive breakpoints at 768px, 992px, 1200px

### **Event Delegation**
- Single event listeners for multiple elements
- Better performance with dynamic content
- Reduced memory footprint

---

## 🚀 Setup and Installation

### **Quick Start**

```bash
# Clone the repository
git clone https://github.com/vophuthinh/vophuthinh.com.git

# Navigate to project directory
cd vophuthinh.com

# Open in browser (no build step required!)
open index.html
```

### **For Development**

```bash
# Install dependencies (optional, only for linting/formatting)
npm install

# Start local development server
npm run dev
# or
python -m http.server 8000

# Visit http://localhost:3000 (or 8000)
```

---

## ⚙️ Configuration

### **1. EmailJS Setup** (for contact form)
Edit `js/config.js` and update:
```javascript
EMAIL: {
  SERVICE_ID: 'your_service_id',
  TEMPLATE_ID: 'your_template_id',
  PUBLIC_KEY: 'your_public_key',
  FALLBACK_EMAIL: 'your_email@example.com'
}
```

### **2. Projects Data**
Edit `js/projects-data.js` to add/remove/edit projects:
```javascript
{
  id: 5,
  title: 'Your Project Title',
  category: 'llm', // or 'cv', 'mlops', 'data'
  summary: 'Brief one-liner',
  problem: 'What problem does it solve?',
  solution: 'How did you solve it?',
  stack: ['Tech1', 'Tech2', 'Tech3'],
  impact: [
    { label: '↑ Metric', value: '25% better' }
  ],
  results: 'Detailed results paragraph',
  link: 'https://demo-link.com',
  github: 'https://github.com/yourrepo',
  image: './assets/images/portfolio/portfolio-5.jpg'
}
```

### **3. Theme Colors**
Modify CSS variables in `assets/css/skins/color-*.css`:
```css
:root {
  --skin-color: #ec1839;
  --skin-gradient: #ff4b5c;
  /* ... */
}
```

---

## 📖 Usage Guide

### **Adding a New Project**

1. Open `js/projects-data.js`
2. Add a new object to the `projectsData` array
3. Follow the structure shown in the Configuration section above
4. Add project image to `assets/images/portfolio/`
5. Refresh the page to see changes

### **Customizing Theme**

1. Click the gear icon (⚙️) in the bottom right
2. Choose from 5 color themes
3. Toggle light/dark mode with sun/moon icon

### **Contact Form**

- Validates email format automatically
- Shows success/error alerts with SweetAlert2
- Falls back to mailto: if EmailJS unavailable

---

## 🧪 Code Quality

### **Security**
- ✅ Content Security Policy (CSP)
- ✅ HTML escaping to prevent XSS
- ✅ No inline scripts (all external)
- ✅ Secure headers configuration

### **Performance**
- ✅ Lazy loading images with Intersection Observer
- ✅ WebP image format support (automatic detection)
- ✅ Deferred script loading
- ✅ Optimized animations (CSS transforms, GPU-accelerated)
- ✅ Event delegation for better memory usage
- ✅ Core Web Vitals monitoring
- ✅ Resource preloading for critical assets

### **Accessibility**
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Semantic HTML5
- ✅ Focus management in modals

### **Best Practices**
- ✅ Modular code organization
- ✅ Configuration-driven architecture
- ✅ Error handling & fallbacks
- ✅ Responsive design (mobile-first)

---

## 🐛 Troubleshooting

### **Projects not loading?**
- Check browser console for errors
- Ensure `projects-data.js` loads before `script.js`
- Verify data structure in `projectsData` array

### **Contact form not working?**
- Check EmailJS credentials in `config.js`
- Ensure API key is valid
- Check browser network tab for API errors

### **Styles not applying?**
- Clear browser cache
- Check for CSS syntax errors
- Ensure color theme is enabled (check for `disabled` attribute)

### **Images not loading?**
- Verify image paths in `projects-data.js`
- Check file names match exactly (case-sensitive)
- Ensure images are in correct directories

---

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Code Style**
- Use 2 spaces for indentation
- Follow EditorConfig settings
- Add comments for complex logic
- Test on mobile devices

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📧 Contact

**Vo Phu Thinh**
- 🌐 Website: [vophuthinh.com](https://vophuthinh.com)
- 📧 Email: vophuthinhcm@gmail.com
- 💼 LinkedIn: [linkedin.com/in/vophuthinh](https://linkedin.com/in/vophuthinh)
- 💻 GitHub: [github.com/vophuthinh](https://github.com/vophuthinh)

---

⭐ **Star this repo if you find it helpful!** ⭐
