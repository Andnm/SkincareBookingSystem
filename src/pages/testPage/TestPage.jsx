import React, { useState } from 'react';
import { Steps, Card, Radio, Checkbox, Button, Typography, Space, Result } from 'antd';
import { recommendationLogic, skinQuestions } from '../../utils/constants';

const { Title, Text, Paragraph } = Typography;

const TestPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState(null);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [`question${questionId}`]: value
    }));
  };

  const handleSubmit = () => {
    const recommendedServices = recommendationLogic(answers);
    setRecommendations(recommendedServices);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations(null);
  };

  const renderQuestion = (question) => {
    if (question.multiple) {
      return (
        <Checkbox.Group
          onChange={(values) => handleAnswer(question.id, values)}
          value={answers[`question${question.id}`]}
        >
          <Space direction="vertical">
            {question.options.map(option => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      );
    }

    return (
      <Radio.Group
        onChange={(e) => handleAnswer(question.id, e.target.value)}
        value={answers[`question${question.id}`]}
      >
        <Space direction="vertical">
          {question.options.map(option => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    );
  };

  if (recommendations) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <Result
            status="success"
            title="Your Skin Analysis Results"
            subTitle="Based on your answers, here are our recommended treatments:"
            extra={
              <Button type="primary" onClick={handleReset}>
                Take Test Again
              </Button>
            }
          />
          <div className="mt-8">
            {recommendations.map((rec, index) => (
              <Card key={index} className="mb-4" size="small">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text type="secondary" className="text-sm">Recommend Services:</Text>
                    <p className='font-bold text-2xl'>{rec.service}</p>
                  </div>
                  <div className='mt-6'>
                    <Text type="secondary" className="text-sm">Description Services:</Text>
                    <Paragraph className="mt-1">{rec.description}</Paragraph>
                  </div>
                </Space>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <Title level={2} className="text-center mb-8">
          Skin Care Consultation
        </Title>
        <Steps
          current={currentStep}
          items={skinQuestions.map((_, index) => ({
            title: `Step ${index + 1}`
          }))}
        />
        <Card style={{ margin: "20px 0px" }}>
          <Title level={4} className="mb-4">
            {skinQuestions[currentStep].question}
          </Title>
          {renderQuestion(skinQuestions[currentStep])}
        </Card>
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentStep(current => current - 1)}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (currentStep === skinQuestions.length - 1) {
                handleSubmit();
              } else {
                setCurrentStep(current => current + 1);
              }
            }}
            disabled={!answers[`question${skinQuestions[currentStep].id}`]}
          >
            {currentStep === skinQuestions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TestPage;