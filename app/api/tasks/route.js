let tasks = [];

// GET - Fetch all tasks
export async function GET() {
    return Response.json(tasks);
}

// POST - Add new task
export async function POST(req) {
    try {
        const body = await req.json();

        if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
            return Response.json({ error: "Title is required" }, { status: 400 });
        }

        const newTask = {
            id: Date.now(),
            title: body.title.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        };

        tasks.push(newTask);
        return Response.json(newTask, { status: 201 });
    } catch (error) {
        return Response.json({ error: "Invalid request payload" }, { status: 400 });
    }
}

// PATCH - Update task (toggle complete or change title)
export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, completed, title } = body;

        const task = tasks.find((t) => t.id === id);

        if (!task) {
            return Response.json({ error: "Task not found" }, { status: 404 });
        }

        if (typeof completed === "boolean") {
            task.completed = completed;
        }

        if (typeof title === "string" && title.trim()) {
            task.title = title.trim();
        }

        return Response.json(task);
    } catch (error) {
        return Response.json({ error: "Invalid request payload" }, { status: 400 });
    }
}

// DELETE - Remove task
export async function DELETE(req) {
    try {
        const { id } = await req.json();
        const initialLength = tasks.length;
        tasks = tasks.filter((t) => t.id !== id);

        if (tasks.length === initialLength) {
            return Response.json({ error: "Task not found" }, { status: 404 });
        }

        return Response.json({ message: "Deleted successfully" });
    } catch (error) {
        return Response.json({ error: "Invalid request payload" }, { status: 400 });
    }
}