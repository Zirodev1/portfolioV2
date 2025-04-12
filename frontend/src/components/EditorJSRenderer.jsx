import PropTypes from 'prop-types';

/**
 * EditorJSRenderer component for rendering EditorJS content
 * @param {Object} props Component props
 * @param {Object} props.content EditorJS content object with blocks
 * @param {String} props.className Additional CSS classes for the wrapper
 * @returns {JSX.Element} Rendered EditorJS content
 */
const EditorJSRenderer = ({ content, className = '' }) => {
  if (!content || !content.blocks || !Array.isArray(content.blocks) || content.blocks.length === 0) {
    return <div className={className}>No content available</div>;
  }

  return (
    <div className={`editorjs-renderer ${className}`}>
      {content.blocks.map((block, index) => {
        return <Block key={block.id || index} block={block} />;
      })}
    </div>
  );
};

/**
 * Renders a single EditorJS block
 */
const Block = ({ block }) => {
  switch (block.type) {
    case 'paragraph':
      return <p className="mb-4 text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data.text }}></p>;
    
    case 'header':
      switch (block.data.level) {
        case 1:
          return <h1 className="text-3xl font-bold mt-10 mb-5" dangerouslySetInnerHTML={{ __html: block.data.text }}></h1>;
        case 2:
          return <h2 className="text-2xl font-bold mt-8 mb-4" dangerouslySetInnerHTML={{ __html: block.data.text }}></h2>;
        case 3:
          return <h3 className="text-xl font-semibold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: block.data.text }}></h3>;
        case 4:
          return <h4 className="text-lg font-medium mt-4 mb-2" dangerouslySetInnerHTML={{ __html: block.data.text }}></h4>;
        case 5:
          return <h5 className="text-base font-medium mt-4 mb-2" dangerouslySetInnerHTML={{ __html: block.data.text }}></h5>;
        case 6:
          return <h6 className="text-sm font-medium mt-4 mb-2" dangerouslySetInnerHTML={{ __html: block.data.text }}></h6>;
        default:
          return <h3 className="text-xl font-semibold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: block.data.text }}></h3>;
      }
    
    case 'list':
      if (block.data.style === 'ordered') {
        return (
          <ol className="list-decimal list-inside my-4 space-y-2 text-gray-300 pl-4">
            {block.data.items.map((item, i) => (
              <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }}></li>
            ))}
          </ol>
        );
      } else {
        return (
          <ul className="list-disc list-inside my-4 space-y-2 text-gray-300 pl-4">
            {block.data.items.map((item, i) => (
              <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }}></li>
            ))}
          </ul>
        );
      }
    
    case 'code':
      return (
        <div className="my-4">
          <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto">
            <code>{block.data.code}</code>
          </pre>
        </div>
      );
    
    case 'image':
      return (
        <figure className="my-6">
          <img 
            src={block.data.file?.url || block.data.url} 
            alt={block.data.caption || 'Blog image'} 
            className="max-w-full rounded-md"
          />
          {block.data.caption && (
            <figcaption className="text-sm text-gray-400 mt-2 text-center italic">{block.data.caption}</figcaption>
          )}
        </figure>
      );
      
    case 'delimiter':
      return <hr className="my-8 border-gray-700" />;
      
    case 'quote':
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 italic text-gray-300">
          <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
          {block.data.caption && (
            <cite className="text-sm text-gray-400 mt-2 block">— {block.data.caption}</cite>
          )}
        </blockquote>
      );

    case 'table':
      return (
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border-collapse border border-gray-700">
            <tbody>
              {block.data.content.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex === 0 && block.data.withHeadings ? 'bg-gray-700' : ''}>
                  {row.map((cell, cellIndex) => {
                    if (rowIndex === 0 && block.data.withHeadings) {
                      return <th key={cellIndex} className="border border-gray-600 px-4 py-2 text-left">{cell}</th>;
                    }
                    return <td key={cellIndex} className="border border-gray-600 px-4 py-2">{cell}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'checklist':
      return (
        <div className="my-4">
          {block.data.items.map((item, i) => (
            <div key={i} className="flex items-center mb-2">
              <input 
                type="checkbox" 
                checked={item.checked} 
                readOnly
                className="mr-2 h-4 w-4 rounded"
              />
              <span dangerouslySetInnerHTML={{ __html: item.text }}></span>
            </div>
          ))}
        </div>
      );

    case 'embed':
      return (
        <div className="my-6">
          <iframe
            src={block.data.embed}
            className="w-full rounded-md"
            height={block.data.height || 320}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          {block.data.caption && (
            <p className="text-sm text-gray-400 mt-2 text-center italic">{block.data.caption}</p>
          )}
        </div>
      );
      
    default:
      console.log("Unknown block type:", block.type);
      return null;
  }
};

EditorJSRenderer.propTypes = {
  content: PropTypes.shape({
    blocks: PropTypes.array.isRequired,
    time: PropTypes.number,
    version: PropTypes.string
  }).isRequired,
  className: PropTypes.string
};

Block.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired
  }).isRequired
};

export default EditorJSRenderer; 