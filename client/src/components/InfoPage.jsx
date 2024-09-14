import React, { useState, useEffect } from 'react';

const InfoPage = () => {
  const [allInfo, setAllInfo] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0); // Manage current slide index
  const [formData, setFormData] = useState({
    TextHead: '',
    TextData: '',
    TextComment: '',
    LinkHead: '',
    LinkUrl: '',
    LinkComment: '',
    PicHead: '',
    PicFiles: [],
    PicComment: '',
    Key: '',
    TopicId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/info');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Debug log
        setAllInfo(data); // Ensure 'data' is an array
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally, handle error state
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('TextHead', formData.TextHead);
    form.append('TextData', formData.TextData);
    form.append('TextComment', formData.TextComment);
    form.append('LinkHead', formData.LinkHead);
    form.append('LinkUrl', formData.LinkUrl);
    form.append('LinkComment', formData.LinkComment);
    form.append('PicHead', formData.PicHead);
    for (const file of formData.PicFiles) {
      form.append('Pic-Pic', file);
    }
    form.append('PicComment', formData.PicComment);
    form.append('Key', formData.Key);
    form.append('TopicId', formData.TopicId);

    try {
      const response = await fetch('/api/v1/info', {
        method: 'POST',
        body: form
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful response
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? allInfo[0]?.pics.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === allInfo[0]?.pics.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="content center">
      {allInfo.length > 0 ? (
        allInfo.map((info, index) => (
          <div key={index}>
            {/* Render text data */}
            {info.texts && info.texts.length > 0 && (
              <div id="TextDiv">
                {info.texts.map((text, idx) => (
                  <div key={idx}>
                    <p className="Head">
                      {text.header || 'Text'}
                    </p>
                    <textarea
                      id="SearchTextarea"
                      readOnly
                      className="textarea"
                    >
                      {text.text}
                    </textarea>
                    <p className="Comment">
                      {text.comment || 'Comment'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Render link data */}
            {info.links && info.links.length > 0 && (
              <div id="LinkDiv">
                {info.links.map((link, idx) => (
                  <div key={idx}>
                    <p className="Head">
                      {link.header || 'Link'}
                    </p>
                    <a href={link.path} className="Link">
                      {link.path}
                    </a>
                    <p className="Comment">
                      {link.comment || 'Comment'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Render picture data */}
            {info.pics && info.pics.length > 0 && (
              <div id="PicDiv" className="PicDiv">
                <div className="container2">
                  <p className="Head">
                    {info.pics[0].header || 'Pics'}
                  </p>

                  {/* Show current slide */}
                  {info.pics.map((pic, idx) => (
                    <div key={idx} className={`mySlides ${idx === currentSlide ? 'active' : 'hidden'}`}>
                      <img
                        src={`/static/Files/imgs/${pic.path}`}
                        style={{ width: '100%' }}
                        alt={pic.comment || 'Image'}
                      />
                    </div>
                  ))}

                  {/* Slideshow controls */}
                  <a className="prev" onClick={prevSlide}>❮</a>
                  <a className="next" onClick={nextSlide}>❯</a>

                  {/* Optional: Show thumbnail navigation */}
                  <div className="row">
                    {info.pics.map((pic, idx) => (
                      <div key={idx} className="column">
                        <img
                          className="demo cursor"
                          src={`/static/Files/imgs/${pic.path}`}
                          style={{ width: '100%' }}
                          alt={pic.comment || 'Image'}
                          onClick={() => setCurrentSlide(idx)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No information available.</p>
      )}

      <form onSubmit={handleSubmit}>
        <div id="TextDiv">
          <input className="Head" id="TextHead" name="TextHead" placeholder="Head" type="text" value={formData.TextHead} onChange={handleChange} />
          <textarea className="textarea" id="TextData" name="TextData" value={formData.TextData} onChange={handleChange}></textarea>
          <input className="Comment" id="TextComment" name="TextComment" placeholder="Comment" type="text" value={formData.TextComment} onChange={handleChange} />
        </div>

        <div id="LinkDiv" className="none">
          <input className="Head" id="LinkHead" name="LinkHead" placeholder="Head" type="text" value={formData.LinkHead} onChange={handleChange} />
          <input className="Link" id="LinkUrl" name="LinkUrl" placeholder="Link" type="text" value={formData.LinkUrl} onChange={handleChange} />
          <input className="Comment" id="LinkComment" name="LinkComment" placeholder="Comment" type="text" value={formData.LinkComment} onChange={handleChange} />
        </div>

        <div id="PicDiv" className="none">
          <input className="Head" id="PicHead" name="PicHead" placeholder="Head" type="text" value={formData.PicHead} onChange={handleChange} />
          <input className="Pic" id="PicFiles" name="PicFiles" type="file" multiple onChange={handleChange} />
          <input className="Comment" id="PicComment" name="PicComment" placeholder="Comment" type="text" value={formData.PicComment} onChange={handleChange} />
        </div>

        <input className="Key" id="Key" name="Key" placeholder="Search Key" type="text" value={formData.Key} onChange={handleChange} />
        <input list="TopicId" type="search" name="TopicId" id="SearchTopic" className="Key" placeholder="Topic Name" value={formData.TopicId} onChange={handleChange} />
        <datalist id="TopicId">
          {/* Options should be populated dynamically */}
        </datalist>

        <input className="submit" id="Submit" name="Submit" type="submit" value="Save" />
      </form>
    </div>
  );
};

export default InfoPage;
