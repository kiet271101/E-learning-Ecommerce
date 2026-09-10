class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.email = data.email || "";
        this.role = data.role || "";
        this.avatar = data.avatar || null;
    }
}

export default User;