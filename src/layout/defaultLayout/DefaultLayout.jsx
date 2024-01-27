import styles from "./DefaultLayout.module.scss"
import classNames from "classnames/bind";
import Header from "../../components/header/Header";
import { height } from "@mui/system";

const cx = classNames.bind(styles)

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header-wrapper')}>
                <Header />
            </div>
            <div className={cx('content-wrapper')}>
                {children}
            </div> 
            <div style={{height: '50px'}}></div>
        </div>
    );
}

export default DefaultLayout;
