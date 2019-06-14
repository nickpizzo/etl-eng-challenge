import React from 'react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      isUploadDone: false,
    };

    this.handleUploadFile = this.handleUploadFile.bind(this);
  }

  handleUploadFile(e) {
    e.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', 'data1');

    fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ fileUrl: `http://localhost:8000/${body.file}`, isUploadDone: true });
      });
    });
  }

  render() {
    return (
      <form onSubmit={this.handleUploadFile}>
        <div>
          <input
            required
            ref={(ref) => {
              this.uploadInput = ref;
            }}
            type="file"
          />
        </div>
        <br />
        <div>
          <button>Upload</button>
        </div>
        {this.state.isUploadDone ? (
          <a className="btn" href="http://localhost:8000/public/mapped/mapped.csv" download>
            Download Mapped file
          </a>
        ) : null}
      </form>
    );
  }
}

export default Main;
