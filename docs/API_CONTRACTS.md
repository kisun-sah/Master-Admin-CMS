# KBR Digital — API Contracts Catalog

## 1. Public API Client (`/api/v1/public/*`)
| Operation | Function | Endpoint | Method | Purpose |
|---|---|---|---|---|
| Settings | `getSettings()` | `/settings` | GET | Site title, branding colors, contact info |
| Navigation | `getNavigation()` | `/navigation` | GET | Header & footer menus |
| Sliders | `getSliders()` | `/sliders` | GET | Active hero banners & video showreels |
| Services | `getServices()` | `/services` | GET | Published services catalog |
| Single Service | `getServiceBySlug(slug)` | `/services/:slug` | GET | Single service details & SEO schema |
| Pages | `getPublicPages()` | `/pages` | GET | Published custom CMS pages |
| Single Page | `getPageBySlug(slug)` | `/pages/:slug` | GET | Dynamic block-based page |
| Albums | `getGalleryAlbums()` | `/gallery` | GET | Published gallery albums |
| Single Album | `getGalleryAlbumBySlug(slug)` | `/gallery/:slug` | GET | Full album photos |
| Gallery Images | `getGalleryImages()` | `/gallery-images` | GET | Standalone gallery photos |
| Blogs | `getBlogs()` | `/blogs` | GET | Published articles (sorted newest first) |
| Single Blog | `getBlogBySlug(slug)` | `/blogs/:slug` | GET | Longform blog content & SEO |
| Team | `getTeam()` | `/team` | GET | Public team member directory |
| Testimonials | `getTestimonials()` | `/testimonials` | GET | Verified client reviews |
| Partners | `getPartners()` | `/partners` | GET | Partner & technology logos |
| Careers | `getCareers()` | `/careers` | GET | Active career vacancies |
| Single Career | `getCareerBySlug(slug)` | `/careers/:slug` | GET | Career details |
| Job Application | `submitJobApplication(slug, data)` | `/careers/:slug/applications` | POST | Multipart CV application upload |
| FAQs | `getFaqs()` | `/faqs` | GET | Published FAQ list |
| Popup | `getActivePopup()` | `/popups/active` | GET | Active lead-generation modal |
| Contact | `submitContact(data)` | `/contact` | POST | Customer lead/inquiry submission |

## 2. Admin API Client (`/api/v1/*`)
- Uses HttpOnly cookie authentication (`credentials: 'include'`).
- Supports CRUD operations across all 21 CMS modules.
