import { useContext } from 'react';
import { UserContext } from "../contexts/userContext";


function Home() {
    const [state, dispatch] = useContext(UserContext);

    if (!state.isLogin) {
        return (
            <div className="text-center mt-5">
                <img src="../assets/login.png" width="40%" />
                <div>
                    Silahkan Login terlebih dahulu
                </div>
            </div>
        )
    } else {
        return (
            <>
                <img src="../assets/landing.png" className="img-fluid" />
            </>
        )
    }

}
export default Home;