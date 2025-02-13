export default function Documents() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">User Manual</h1>
            <a
                href="https://www.isa.org.jm/wp-content/uploads/2022/04/UserManual_v1.1_20181119.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-lg underline mt-4"
            >
                Open User Manual (PDF)
            </a>
        </div>
    );
}
