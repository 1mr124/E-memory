import React, { useState, useEffect } from 'react';

const SearchPage = () => {
  const [searchKey, setSearchKey] = useState('');
  const [searchKeys, setSearchKeys] = useState([]);
  const [allInfo, setAllInfo] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [keysResponse, infoResponse] = await Promise.all([
          fetch('/api/v1/search-keys'),
          fetch('/api/v1/info')
        ]);
        if (!keysResponse.ok || !infoResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const keysData = await keysResponse.json();
        const infoData = await infoResponse.json();
        setSearchKeys(keysData);
        setAllInfo(infoData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/v1/info?searchKey=${searchKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setAllInfo(data);
    } catch (error) {
      console.error('Error searching info:', error);
    }
  };

  const handlePrevSlide = () => {
    if (selectedInfo && selectedInfo.pics && selectedInfo.pics.length > 0) {
      setCurrentSlide((prevSlide) =>
        prevSlide === 0 ? selectedInfo.pics.length - 1 : prevSlide - 1
      );
    }
  };

  const handleNextSlide = () => {
    if (selectedInfo && selectedInfo.pics && selectedInfo.pics.length > 0) {
      setCurrentSlide((prevSlide) =>
        prevSlide === selectedInfo.pics.length - 1 ? 0 : prevSlide + 1
      );
    }
  };

  const handleSlideClick = (index) => {
    if (selectedInfo && selectedInfo.pics && selectedInfo.pics.length > 0) {
      setCurrentSlide(index);
    }
  };

  return (
    <div className="content center">
      <form onSubmit={handleSearch}>
        <br />
        <input
          list="Keys"
          type="search"
          name="SearchKey"
          className="SearchPage"
          placeholder="Search Key ..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button type="submit" id="s">Search</button>

        <datalist id="Keys">
          {searchKeys.map((key, index) => (
            <option key={index} value={key} />
          ))}
        </datalist>
        <br />
      </form>

      <div>
        {allInfo.length > 0 ? (
          allInfo.map((info, index) => (
            <div key={index}>
              <input
                className="submit2"
                type="button"
                data-s={index}
                value={info.key || index}
                onClick={() => {
                  setSelectedInfo(info);
                  setCurrentSlide(0); // Reset slide index on new selection
                }}
              />
              {selectedInfo === info && (
                <div>
                  {info.text && (
                    <div id="TextDiv">
                      <p className="Head">
                        {info.text.textHead || 'Text'}
                      </p>
                      <textarea
                        id="SearchTextarea"
                        readOnly
                        className="textarea"
                      >
                        {info.text.textData}
                      </textarea>
                      <p className="Comment">
                        {info.text.textComment || 'Comment'}
                      </p>
                    </div>
                  )}
                  {info.links && (
                    <div id="LinkDiv">
                      <p className="Head">
                        {info.links.linkHead || 'Link'}
                      </p>
                      <a href={info.links.linkPath} className="Link">
                        {info.links.linkPath}
                      </a>
                      <p className="Comment">
                        {info.links.linkComment || 'Comment'}
                      </p>
                    </div>
                  )}
                  {info.pics && info.pics.length > 0 && (
                    <div id="PicDiv" className="PicDiv">
                      <div className="container2">
                        <p className="Head">
                          {info.pics[currentSlide].picHead || 'Pics'}
                        </p>
                        <div className="mySlides">
                          <img
                            src={`/static/Files/imgs/${info.pics[currentSlide].picPath}`}
                            style={{ width: '100%' }}
                            alt={info.pics[currentSlide].picComment || 'Image'}
                          />
                        </div>
                        <a className="prev" onClick={handlePrevSlide}>❮</a>
                        <a className="next" onClick={handleNextSlide}>❯</a>
                        <div className="caption-container2">
                          <p id="caption">{info.pics[currentSlide].picComment || ''}</p>
                        </div>
                        <div className="row">
                          {info.pics.map((pic, idx) => (
                            <div key={idx} className="column">
                              <img
                                className="demo cursor"
                                src={`/static/Files/imgs/${pic.picPath}`}
                                style={{ width: '100%' }}
                                alt={pic.picComment || 'Image'}
                                onClick={() => handleSlideClick(idx)}
                              />
                            </div>
                          ))}
                        </div>
                        <br />
                        <br />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No information found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
