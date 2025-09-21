import React from "react";
import Navbar from "../components/navbar";

const RecommendTopics: React.FC = () => {
  return (
    <div style={{
        backgroundImage: "url('/image.jpg')",
      }}>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 mt-6">
        <div className="bg-black bg-opacity-40 text-white rounded-2xl shadow-lg p-10 backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-6">Recommended Topics to Boost Your Skills</h1>

          <p className="mb-4">
            Learning something new can feel overwhelming, especially when you don’t know where to start.
            This guide will help you identify key areas to focus on depending on your interests and goals.
            Think of it as a roadmap: if you want to achieve X, focus on Y. Each section below provides
            guidance, actionable steps, and resources to explore further.
          </p>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">1. Web Development</h2>
            <p className="mb-2">
              If you want to build websites or web applications, web development is a crucial skill.
              Start with HTML, CSS, and JavaScript to get the fundamentals. Then, move to frameworks like
              React, Angular, or Vue.js for building interactive UIs.
            </p>
            <p className="mb-2">
              Learning backend technologies such as Node.js, Express, or Django will allow you to create full-stack applications.
              Understanding databases, both SQL and NoSQL, is also highly recommended. This knowledge will help you build
              real-world projects and prepare you for job interviews.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">2. Data Science and Machine Learning</h2>
            <p className="mb-2">
              If your goal is to work with data, start with Python and its powerful libraries like Pandas, NumPy,
              and Matplotlib. R is also a great choice for statistical analysis and visualization.
            </p>
            <p className="mb-2">
              Once comfortable with programming, learn machine learning algorithms such as linear regression,
              decision trees, and clustering. Tools like scikit-learn, TensorFlow, or PyTorch can help implement
              these algorithms practically. Building projects like predictive models, dashboards, and data visualizations
              will solidify your understanding.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">3. Cybersecurity</h2>
            <p className="mb-2">
              If you are interested in protecting systems and networks, cybersecurity is a key field. Start with
              understanding networking basics, operating systems, and security fundamentals such as encryption and authentication.
            </p>
            <p className="mb-2">
              Practical exercises like penetration testing, vulnerability assessment, and setting up secure servers will
              reinforce your knowledge. Tools like Wireshark, Kali Linux, and Metasploit are widely used in this domain.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">4. DevOps and Cloud Computing</h2>
            <p className="mb-2">
              DevOps focuses on bridging the gap between development and operations. Learning CI/CD pipelines, Docker,
              Kubernetes, and cloud platforms like AWS, Azure, or Google Cloud can significantly improve your workflow and
              employability.
            </p>
            <p className="mb-2">
              Automating deployment, monitoring applications, and scaling services are crucial skills that DevOps engineers
              need. Start with small projects like containerizing a web app and deploying it to the cloud.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">5. Soft Skills and Continuous Learning</h2>
            <p className="mb-2">
              Technical skills are important, but communication, problem-solving, and teamwork are equally vital.
              Work on personal projects, contribute to open-source, and participate in hackathons to improve both
              technical and soft skills.
            </p>
            <p className="mb-2">
              Continuous learning is key: technology evolves rapidly. Subscribe to newsletters, follow industry blogs,
              and take online courses to stay updated with the latest trends.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Final Thoughts</h2>
            <p>
              Start small, pick a topic that excites you, and gradually expand your knowledge. Mix practical
              projects with theoretical learning, and remember that consistency is more important than speed.
              Over time, these recommended topics will equip you with a well-rounded skill set that opens up
              diverse career opportunities.
            </p>
          </section>
        </div>
      </div>

      <footer className="mt-16 mb-6 px-6">
        <div className="bg-black bg-opacity-60 text-gray-300 rounded-2xl shadow-lg py-6 text-center">
          <p>&copy; 2025 SuggestiFy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RecommendTopics;
