import React from 'react';
import { List, Card, Typography, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { blogData } from '../../utils/constants';

const { Title, Text, Paragraph } = Typography;

const Blogs = () => {
  const navigate = useNavigate();

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  return (
    <div className="light-gray-background pb-20">
      <div
        className="banner-services bg-cover bg-center w-full h-[400px] relative"
        style={{
          backgroundImage:
            'url("https://www.clinikally.com/cdn/shop/articles/Skincare_Routine_for_Combination_Skin.png?v=1678102742&width=1500")',
        }}
      >
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-3xl font-semibold text-blue-900">
            Beauty & Skincare Blog
          </h2>
        </div>
      </div>

      <div className="mt-20" />

      <div className="container" style={{ padding: '24px' }}>

        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={blogData}
          renderItem={(blog) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => handleBlogClick(blog.id)}
                cover={<img alt={blog.title} src={blog.image} style={{ height: 200, objectFit: 'cover' }} />}
              >
                <Card.Meta
                  title={blog.title}
                  description={
                    <Space direction="vertical">
                      <Text type="secondary">{blog.author} - {blog.date}</Text>
                      <Paragraph ellipsis={{ rows: 2 }}>{blog.summary}</Paragraph>
                      <Space size={[0, 8]} wrap>
                        {blog.tags.map((tag) => (
                          <Tag key={tag} color="pink">{tag}</Tag>
                        ))}
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Blogs;