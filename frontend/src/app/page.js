import AdminDashboard from "./components/AdminDashboard";

export default function Home() {
  const mockUser = {
    name: 'Admin User',
    email: 'admin@dadacetwala.com',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'admin'
  };
  return (
    <AdminDashboard user={mockUser} />
  );
}
