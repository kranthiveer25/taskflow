import { Leaf, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={18} color="white" />
          <span className="footer-brand">TaskFlow</span>
        </div>
        <span className="footer-text">
          Developed with <Heart size={13} color="#a5d6a7" fill="#a5d6a7" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 3px' }} /> by <strong>K. KRANTHI VEER</strong>
        </span>
        <span className="footer-copy">© {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
