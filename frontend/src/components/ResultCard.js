import React from "react";
import ReactMarkdown from "react-markdown";

const ResultCard = ({ title, icon, content }) => {
  // If content is an array, convert it to markdown bullet points
const markdownContent = Array.isArray(content)
  ? content.join("\n")
  : content;

  return (
    <div className="mb-8 p-6 rounded-xl border border-gray-700 bg-[#0f172a] shadow-lg">
      <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>

      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => (
            <p {...props} className="text-sm text-gray-300 leading-relaxed" />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="ml-5 list-disc text-sm text-gray-300" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="text-white font-semibold" />
          ),
          em: ({ node, ...props }) => (
            <em {...props} className="text-cyan-400 italic" />
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default ResultCard;
