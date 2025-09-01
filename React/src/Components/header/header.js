import './header.css';
import {Link, useNavigate} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Header = ()=>{

    const navigate = useNavigate();
    const logout = async ()=>{
        await axios.post('http://localhost:5000/api/logout',{token:JSON.parse(localStorage.getItem('token'))})
        navigate('/login')
      }

      const id = useSelector(state=> state.login_id)

    return (
        <header>
        <div class="site-name">PerfectlyMatched</div>
        {id && <nav>
          <ul className="menu">
          <li>
              <Link to={`/user`}>
                <i className="fas fa-random"></i> Picks
              </Link>
            </li>
            {/* <li>
              <Link to={`/user/match`}>
                <i className="fas fa-fire"></i> Hots
              </Link>
            </li> */}
            <li>
              <Link to={`/user/match`}>
                <i className="fas fa-heart"></i> Matches
              </Link>
            </li>
            {/* <li>
              <Link to="/profile">
                <i className="fas fa-user"></i> My Profile
              </Link>
            </li> */}
            <li>
              <Link  onClick={logout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </Link>
            </li>
          </ul>
        </nav>}
      </header>
    )
}

export default Header