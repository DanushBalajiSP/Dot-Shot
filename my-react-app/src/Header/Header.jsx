import './Header.css';

function Header() {
    return (
        <div className="header-content">
            <h1 className="header-title">The Idea Spark</h1>
            <ul className="header-list">
                <li className="header-item"><a href="/">Home</a></li>
                <li className="header-item"><a href="/about">About</a></li>
                <li className="header-item"><a href="/contact">Contact</a></li>
            </ul>
        </div>
    );
}
export default Header;