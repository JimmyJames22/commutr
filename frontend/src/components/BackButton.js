import "../stylesheets/ButtonStyles.css"
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';


function BackButton() {

    const navigate = useNavigate();

    const toHome =()=>{
        navigate("/");
    }

    return(
            <div className="back-button-div">
                <button className="back-btn" onClick={toHome}>< FaArrowLeft /></button>
            </div>
    )
}

export default BackButton