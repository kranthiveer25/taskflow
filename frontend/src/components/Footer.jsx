import { Leaf, Mail, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={18} color="white" />
          <span className="footer-brand">TaskFlow</span>
        </div>
        <span className="footer-text">
          Developed by <strong>K. KRANTHI VEER</strong>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="footer-contact">
            <Mail size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            kranthiveer.kammari19@gmail.com
          </span>
          <span className="footer-contact">
            <Phone size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            +91 7780690478
          </span>
        </div>
        <span className="footer-copy">© {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
