import Header from "./Header";
import Footer from "./Footer";
import Container from "./Container";
import TodoForm from "./TodoForm";
import "./inc/sass/main.scss";

function App() {
    return (
        <>
            <Header />
            <Container>
                <TodoForm />
            </Container>
            <Footer />
        </>
    );
}

export default App;
