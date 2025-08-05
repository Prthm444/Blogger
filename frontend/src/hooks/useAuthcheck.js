import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuthCheck = () => {
	const dispatch = useDispatch();
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	useEffect(() => {
		const checkLogin = async () => {
			try {
				const res = await axios.get(`${SERVER_URL}/user/verifyuser`, {
					withCredentials: true,
				});
				dispatch(setUser({ user: res.data.data }));
				
			} catch (err) {
				dispatch(clearUser());
				
			}
		};

		checkLogin();
	}, []);
	return null;
};

export default useAuthCheck;
