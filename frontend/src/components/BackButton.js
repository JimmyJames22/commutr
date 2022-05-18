import "../stylesheets/ButtonStyles.css"
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';


function BackButton() {

    const navigate = useNavigate();

    const goBack =()=>{
        navigate(-1);
    }

    return(
            <div className="button-div">
                <div className="back-btn-div">
                <button className="back-btn" onClick={goBack}>< FaArrowLeft /></button>
                </div>
            </div>
    )
}

export default BackButton