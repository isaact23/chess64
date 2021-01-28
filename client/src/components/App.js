import './App.scss';
import Home from './Home';

function App() {
    function getCurrentPage() {
        return <Home/>;
    }

    return (
        <div className="App">
            {getCurrentPage()}
        </div>
    );
}

export default App;
