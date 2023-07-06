import './header.css';
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { PiGhost } from "react-icons/pi";
// headerをコンポーネント化する
function Baner(){
    return(

        <div className='header'>
            <div className='header-left'>
                <PiGhost size={45}/>
            </div>

            <div className="header-center">
                <h1>Pilgerfahrt</h1>
                
            </div>
            <div className='header-line'></div>
            <div className='header-line'></div>
        </div>
       
        
    )
}

export default Baner;

