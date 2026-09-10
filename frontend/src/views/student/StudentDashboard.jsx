import authService from "../../services/authService";

function StudentDashboard() {

    const user = authService.getCurrentUser();

    return (
        <div style={styles.container}>

            <h1>
                Student Dashboard
            </h1>

            <div style={styles.card}>

                <h2>
                    Xin chào, {user?.name}
                </h2>

                <p>
                    Email: {user?.email}
                </p>

                <p>
                    Vai trò: {user?.role}
                </p>

            </div>

        </div>
    );
}

const styles = {

    container: {
        padding: "40px"
    },

    card: {
        marginTop: "20px",
        padding: "25px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
    }

};

export default StudentDashboard;