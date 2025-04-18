
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FinanceTracker</h3>
            <p className="text-muted-foreground">
              Track your personal finances, manage expenses, and stay on top of your financial goals.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">Dashboard</Link>
              </li>
              <li>
                <Link to="/income" className="text-muted-foreground hover:text-primary">Income</Link>
              </li>
              <li>
                <Link to="/expenses" className="text-muted-foreground hover:text-primary">Expenses</Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-primary">Financial News</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Email: support@financetracker.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 Finance St, Money City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-6 text-center text-muted-foreground">
          <p>© {currentYear} FinanceTracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
