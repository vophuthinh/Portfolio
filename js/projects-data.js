// Projects data - AI Engineer Portfolio

const projectsData = [
  {
    id: 1,
    title: 'RAG-Powered Document Q&A System',
    category: 'llm',
    summary: 'Enterprise-grade RAG system for semantic document search with GPT-4 integration',
    problem: 'Organizations struggle to extract insights from large document repositories. Traditional keyword search is limited and doesn\'t understand context or semantic meaning.',
    solution: 'Built a Retrieval-Augmented Generation (RAG) system using LangChain and FAISS. The system chunks documents, generates embeddings, and retrieves relevant context before generating answers with GPT-4. Implemented reranking for improved accuracy.',
    stack: ['LangChain', 'FAISS', 'OpenAI API', 'Python', 'FastAPI', 'Docker'],
    impact: [
      { label: '↓ Latency', value: '40% faster' },
      { label: '↑ Accuracy', value: '92%' },
      { label: '↑ Scale', value: '1000+ concurrent' }
    ],
    results: 'Reduced query response time by 40% compared to full document search. Achieved 92% accuracy on domain-specific questions. Handles 1000+ concurrent queries with sub-second latency.',
    link: '#',
    github: 'https://github.com/vophuthinh/rag-document-qa',
    image: './assets/images/portfolio/portfolio-1.jpg'
  },
  {
    id: 2,
    title: 'Object Detection Pipeline',
    category: 'cv',
    summary: 'Real-time computer vision pipeline with YOLOv8 and TensorRT optimization',
    problem: 'Need for real-time object detection in video streams with high accuracy and low latency for production use cases.',
    solution: 'Developed an end-to-end computer vision pipeline using YOLOv8 for object detection. Implemented preprocessing, inference optimization, and post-processing with TensorRT for GPU acceleration. Built REST API with FastAPI for integration.',
    stack: ['PyTorch', 'YOLOv8', 'TensorRT', 'OpenCV', 'FastAPI', 'Docker'],
    impact: [
      { label: '↑ Throughput', value: '10K+ images/day' },
      { label: '↑ Accuracy', value: '95%' },
      { label: '↓ Latency', value: '60% faster' }
    ],
    results: 'Processes 10K+ images per day with 95% accuracy. Reduced inference time by 60% with TensorRT optimization. Deployed on Kubernetes with auto-scaling.',
    link: '#',
    github: '#',
    image: './assets/images/portfolio/portfolio-2.jpg'
  },
  {
    id: 3,
    title: 'MLOps Training Pipeline',
    category: 'mlops',
    summary: 'End-to-end MLOps infrastructure with experiment tracking and automated deployment',
    problem: 'Manual model training and deployment processes are error-prone, time-consuming, and lack reproducibility. Need for automated ML lifecycle management.',
    solution: 'Designed and implemented a complete MLOps pipeline using MLflow for experiment tracking, Airflow for orchestration, and Kubernetes for deployment. Automated data validation, model training, evaluation, and A/B testing workflows.',
    stack: ['MLflow', 'Airflow', 'Kubernetes', 'Docker', 'Python', 'TensorFlow'],
    impact: [
      { label: '↓ Deployment', value: '60% faster' },
      { label: '↑ Tracking', value: '100% coverage' },
      { label: '↑ Reliability', value: 'Zero-downtime' }
    ],
    results: 'Reduced model deployment time by 60%. Improved experiment reproducibility with 100% tracking coverage. Enabled A/B testing with zero-downtime deployments.',
    link: 'https://github.com/vophuthinh/mlops-pipeline',
    github: 'https://github.com/vophuthinh/mlops-pipeline',
    image: './assets/images/portfolio/portfolio-3.jpg'
  },
  {
    id: 4,
    title: 'Predictive Analytics System',
    category: 'data',
    summary: 'Scalable forecasting platform with Spark and XGBoost for real-time predictions',
    problem: 'Business needs accurate forecasts for demand planning and resource allocation. Existing solutions lack flexibility and real-time capabilities.',
    solution: 'Built a scalable analytics platform using Spark for data processing, feature engineering pipelines, and scikit-learn/XGBoost for predictive modeling. Implemented real-time feature serving and model monitoring.',
    stack: ['Apache Spark', 'XGBoost', 'scikit-learn', 'Pandas', 'SQL', 'Python'],
    impact: [
      { label: '↑ Accuracy', value: '25% better' },
      { label: '↑ Scale', value: '1TB+ daily' },
      { label: '↓ Time', value: 'Hours → minutes' }
    ],
    results: 'Improved forecast accuracy by 25% compared to baseline. Processes 1TB+ of data daily. Reduced feature engineering time from hours to minutes.',
    link: '#',
    github: '#',
    image: './assets/images/portfolio/portfolio-4.jpg'
  }
];

// Configuration constants
const projectConfig = {
  MAX_TECH_CHIPS_DISPLAY: 4,
  MAX_IMPACT_CHIPS_DISPLAY: 3
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projectsData, projectConfig };
}
