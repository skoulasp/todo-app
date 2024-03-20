import reactImage from "./inc/img/react.png";

function Footer() {
    return (
        <footer id="footer" className="page-footer">
            <div className="footer-content-wrapper">
                Created with{" "}
                <a href="https://react.dev/" target="_blank" rel="noreferrer">
                    <img
                        src={reactImage}
                        alt="React Logo"
                        width="30"
                        className="react-logo-img"
                        style={{ display: "inline-block", margin: "0 5px", verticalAlign: "middle" }}
                    />
                </a>{" "}
                By Petros Skoulas in 2023.
            </div>
        </footer>
    );
}

export default Footer;
