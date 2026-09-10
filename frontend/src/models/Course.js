class Course {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || "";
        this.slug = data.slug || "";
        this.description = data.description || "";
        this.price = Number(data.price || 0);
        this.thumbnail = data.thumbnail || null;
        this.status = data.status || "";
        this.teacher = data.teacher || null;
        this.category = data.category || null;
    }
}

export default Course;