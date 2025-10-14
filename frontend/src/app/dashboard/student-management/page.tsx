import { StudentManagementDashboard } from '@/components/widgets/profile/StudentManagementDashboard';

export const metadata = {
  title: 'Quản lý Học sinh | Student Management System',
  description: 'Hệ thống quản lý hồ sơ và đo lường mức độ học tập của học sinh',
};

export default function StudentManagementPage() {
  return <StudentManagementDashboard />;
}