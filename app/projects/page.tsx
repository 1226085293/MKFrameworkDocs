// app/projects/page.tsx - 只负责 metadata 和布局
import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
    title: 'MKFrameworkDocs - 项目展示',
};

export default function ProjectsPage() {
    return <ProjectsClient />;
}
