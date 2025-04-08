import axios from "axios";
import {getParameterByName,baseURL,authUrl,cmsUrl} from '../root/util';

const LoginForm = () => {
    const [userName,setUserName]=useState('');
    const[password,setPassword]=useState('');
    const[userError,setUserError]=useState();
    const[passwordError,setPasswordError] = useState();
    const [error,setError]=useState();


    let userData =sessionStorage.getItem("userData")?JSON.parse(sessionStorage.getItem("userData")):"";
    console.log(userData);
    let originURL = window.location.href.indexOf('localhost') > 0 ?'https://pos.menulive.in':window.location.origin;
    // const cmsUrl = 'https://cms.digitallive24.com';
//  let authUrl="https://auth.digitallive24.com?redirect=https://pos.menulive.in"

  
// cmsUrl+"/api/users/signin"
  const userId =userData?userData._id:" ";
    const handleUser=(e)=>{
        setUserName(e.target.value);
        
    }                                                                     
        setPassword(e.target.value );
        
    }
    const validate =(event)=>{
        event.preventDefault();
        let nameError='';
        let passError='';
        if(!userName || userName.trim()===''){
            console.log("object");
            nameError="Enter a Username";
        }
        if(!password || password.trim() === '' ){
            passError="Enter Password"
        }
        if (nameError || passError) {
            setPasswordError(passError);
           setUserError(nameError);
            return false;
        }
        else{
            axios.post(cmsUrl+"/api/users/signin",{
                username:userName,
                password:password,
            })
            .then(res=>{
                if(res.error)
                { 
                    console.log(res.error);
                 setError(res.message);
                }else{
                    console.log(res.data.token);
                    sessionStorage.setItem("token",res.data.token)
                    setUserName("");
                    setPassword("");
                    window.location.reload();
                }
               
            }).catch((err)=>{
                console.log(err.response.data)
                setError(err.response.data);
            });
        }

          return true  ;
    }

    

  return (
   
        <div className='login-form'>
         <div className="login-container">
            <h2>Log In</h2>
            <form onSubmit={(e)=>validate(e)} autoComplete="on">
               {error&& <span className='err-msg'>{error.message}</span>}<br/><br/>
                <TextField 
                 defaultValue={userName}
                    label="Username*"
                    name="Username"
                    type='text' 
                    placeholder="Enter Username"
                    variant="standard" 
                    onChange={handleUser}
                /><br/>
                <span style={{color:"red",fontSize:"12px",marginLeft:"-100px"}}>{userError}</span>
                <br />
                <TextField 
                 defaultValue={password}
                    label="Password*" 
                    name="Password"
                    type="password" 
                    variant="standard"  
                    onChange={handlePassword}
                    /><br/>
                    <span style={{color:"red",fontSize:"12px",marginLeft:"-115px"}}>{passwordError}</span>
                    <br/>

                 <button type='submit' className='btn w-50 btn-primary m-2' >Login</button>
             </form>
         </div>
        </div>
   
  )


export default LoginForm