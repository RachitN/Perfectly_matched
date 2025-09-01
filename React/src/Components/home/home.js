import './home.css';
import { Link } from 'react-router-dom';
const Home = ()=>{
    return(
    <div className="home">
            <header>
        <div class="site-name">PerfectlyMatched</div>
        <nav>
            <a href="#"><Link to='/login'>Login</Link></a>
            <a href="#"><Link to='/signup'>Register</Link></a>
        </nav>
    </header>

    <div class="description">
        <h1>Welcome to PerfectlyMatched</h1>
        <p>Your perfect match is just a click away! Join us to find meaningful connections and build lasting relationships.</p>
    </div>

    </div>)
}

export default Home