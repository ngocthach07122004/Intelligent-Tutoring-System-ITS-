import React from 'react'
import Image from 'next/image';

export default function AboutUs() {
    const teamMembers = [
        { name: 'Nguyễn Văn An', role: 'Trưởng dự án', avatar: '/images/team/an.jpg' },
        { name: 'Trần Thị Bình', role: 'Lập trình viên Front-end', avatar: '/images/team/binh.jpg' },
        { name: 'Lê Minh Châu', role: 'Lập trình viên Back-end', avatar: '/images/team/chau.jpg' },
        { name: 'Phạm Quốc Đạt', role: 'Thiết kế UI/UX', avatar: '/images/team/dat.jpg' },
        { name: 'Hoàng Thu Hà', role: 'Chuyên gia AI & Cá nhân hóa', avatar: '/images/team/ha.jpg' },
        { name: 'Vũ Đức Long', role: 'Quản lý nội dung', avatar: '/images/team/long.jpg' },
        { name: 'Đỗ Thị Mai', role: 'Kiểm thử & QA', avatar: '/images/team/mai.jpg' },
    ];
    return (
        <main className="bg-background text-gray-900 dark:text-white pt-10">
            <section className="bg-blue-800 text-white py-24 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">TITLE</h1>
                <p className="max-w-2xl mx-auto text-lg">
                    Xây dựng nền tảng dạy học trực tuyến cá nhân hóa, giúp học sinh tiến bộ nhanh chóng và giảng viên quản lý dễ dàng.
                </p>
            </section>

            <section className="py-16 px-6 md:px-12">
                <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Sứ Mệnh & Tầm Nhìn</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Sứ Mệnh</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                        Trao quyền cho mọi học sinh học tập hiệu quả thông qua công nghệ cá nhân hóa.
                    </p>
                    </div>
                    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Tầm Nhìn</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                        Trở thành nền tảng học trực tuyến hàng đầu, giúp hàng triệu người chinh phục tri thức.
                    </p>
                    </div>
                </div>
                </div>
            </section>

            <section className="py-16 px-6 md:px-12">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Câu Chuyện Của ITS</h2>
                    <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
                    ITS ra đời với mong muốn phá bỏ rào cản của phương pháp học truyền thống. Chúng tôi tin rằng mỗi học sinh đều có tiềm năng riêng, và với công nghệ cá nhân hóa, chúng tôi giúp họ học tập hiệu quả hơn, đồng thời hỗ trợ giảng viên quản lý lớp học dễ dàng và linh hoạt.
                    </p>
                </div>
            </section>

            <section className="py-16 px-6 md:px-12 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">Đội Ngũ Phát Triển</h2>
                    <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg mb-12">
                    Gặp gỡ đội ngũ 7 thành viên đầy nhiệt huyết đứng sau ITS, cùng nhau xây dựng nền tảng học tập của tương lai.
                    </p>

                    {/* Hàng đầu: 4 card */}
                    <div className="flex flex-wrap justify-center gap-6">
                    {teamMembers.slice(0, 4).map((member, index) => (
                        <div
                        key={index}
                        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow w-[220px]"
                        >
                        <Image
                            src={member.avatar}
                            alt={member.name}
                            width={120}
                            height={120}
                            className="rounded-full mx-auto mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                        </div>
                    ))}
                    </div>

                    {/* Hàng cuối: 3 card căn giữa */}
                    <div className="flex flex-wrap justify-center gap-6 mt-6">
                    {teamMembers.slice(4).map((member, index) => (
                        <div
                        key={index}
                        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow w-[220px]"
                        >
                        <Image
                            src={member.avatar}
                            alt={member.name}
                            width={120}
                            height={120}
                            className="rounded-full mx-auto mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
        </main>
    )
}