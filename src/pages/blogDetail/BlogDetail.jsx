import React from 'react';
import { Typography, Space, Tag, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { blogData } from '../../utils/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../../utils/helpers';

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
    useScrollToTop();

    const { id } = useParams();
    const navigate = useNavigate();
    const blog = blogData.find(blog => blog.id === Number(id));

    if (!blog) {
        return <div>Blog not found</div>;
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/blogs')}
                style={{ marginBottom: '20px' }}
            >
                Back to Blogs
            </Button>

            <img
                src={blog.image}
                alt={blog.title}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                loading='lazy'
            />

            <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '24px' }}>
                <Title level={1}>{blog.title}</Title>

                <Space>
                    <Text type="secondary">Author: {blog.author}</Text>
                    <Text type="secondary">Published: {blog.date}</Text>
                </Space>

                <Space size={[0, 8]} wrap>
                    {blog.tags.map((tag) => (
                        <Tag key={tag} color="pink">{tag}</Tag>
                    ))}
                </Space>

                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    {blog.content}
                </Paragraph>
            </Space>
        </div>
    );
};

export default BlogDetail;