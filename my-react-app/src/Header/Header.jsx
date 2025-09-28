import './Header.css';

function Header() {
    return (
        <>
            <header>
                <h1 className="header-title">Welcome to My React App</h1>
                <ul className="header-list">
                    <li className="header-item"><a href="/">Home</a></li>
                    <li className="header-item"><a href="/about">About</a></li>
                    <li className="header-item"><a href="/contact">Contact</a></li>
                </ul>
            </header>
        </>
    );
}
export default Header;