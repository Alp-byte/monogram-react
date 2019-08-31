import React, { Component, Fragment } from 'react';
import Rodal from 'rodal';
import Portal from '../HOC/Portal';
import { FaQuestionCircle } from 'react-icons/fa';

export class HelpModal extends Component {
  constructor(props, context) {
    super(props, context);
    const showIntro = localStorage.getItem('skipIntro');

    this.state = {
      show: !showIntro,
      tutorial: undefined
    };
  }

  handleClose = () => {
    this.setState({ show: false, tutorial: undefined });
    localStorage.setItem('skipIntro', true);
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleSetTutorial = tutorialNum => {
    const checkedTutorials =
      JSON.parse(localStorage.getItem('checkedTutorials')) || {};
    if (tutorialNum && !checkedTutorials[tutorialNum]) {
      localStorage.setItem(
        'checkedTutorials',
        JSON.stringify({
          ...checkedTutorials,
          [tutorialNum]: true
        })
      );
    }
    this.setState({ tutorial: tutorialNum });
  };

  render() {
    const { tutorial } = this.state;
    const checkedTutorials =
      JSON.parse(localStorage.getItem('checkedTutorials')) || {};
    return (
      <Fragment>
        <span className="help_button" onClick={this.handleShow}>
          Need Help <FaQuestionCircle />
        </span>
        <Portal>
          <Rodal
            visible={this.state.show}
            onClose={this.handleClose}
            customStyles={{
              width: 900,
              height: 750
            }}
            className="overright"
          >
            <section
              className="modal_body"
              style={{
                height: '100%'
              }}
            >
              {!tutorial && (
                <div
                  className="modal_start"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div className="modal_start_header">
                    <header className="modal_start_header_title">
                      Welcome to Monogram Maker
                    </header>
                    <div className="modal_start_header_text">
                      Create stunning monogram logos in a few clicks today. If
                      you want to learn *how*, see our quick tutorials below:
                    </div>
                  </div>

                  <div className="modal_start_tutorials">
                    <div
                      onClick={() => this.handleSetTutorial(1)}
                      className={`modal_start_tutorials_block ${
                        checkedTutorials[1] ? 'checked' : ''
                      }`}
                    >
                      <img
                        src={require('../assets/img/selection.png')}
                        alt=""
                      />
                      <strong>Frame & Font Selections</strong>
                    </div>
                    <div
                      onClick={() => this.handleSetTutorial(2)}
                      className={`modal_start_tutorials_block ${
                        checkedTutorials[2] ? 'checked' : ''
                      }`}
                    >
                      <img
                        src={require('../assets/img/free-transform.png')}
                        alt=""
                      />
                      <strong>Free Transform</strong>
                    </div>
                    <div
                      onClick={() => this.handleSetTutorial(3)}
                      className={`modal_start_tutorials_block ${
                        checkedTutorials[3] ? 'checked' : ''
                      }`}
                    >
                      <img src={require('../assets/img/layers.png')} alt="" />
                      <strong>Layers</strong>
                    </div>
                  </div>

                  <button onClick={this.handleClose} className="skip red">
                    Skip Tutorial
                  </button>
                </div>
              )}

              {tutorial && (
                <div className="modal_tutorial">
                  {tutorial === 1 && (
                    <div className="modal_tutorial_content">
                      With <span className="highlight">Sidebar</span> which is
                      located on the left side of the application you can:
                      <div className="list">
                        <div>
                          1.<p className="bold"> Enter your monogram text</p>
                        </div>
                        <div>
                          {' '}
                          2.
                          <p className="bold"> Select a Font</p> for your
                          monogram text
                        </div>
                        <div>
                          3.
                          <p className="bold"> Select a Frame</p>
                        </div>
                      </div>
                      <img
                        className="gif"
                        src={require('../assets/img/Frame_Font_selection.gif')}
                        alt="frameSelection"
                      />
                      <p className="note">
                        Note: After you type a value or select frame with no{' '}
                        <span className="highlight">Layer</span>
                        selected - new layer with this object will be created
                        and drawn on <span className="highlight">
                          Canvas
                        </span>{' '}
                        You also can change frame/font/text for selected{' '}
                        <span className="highlight">Layer</span> to see a
                        difference.
                      </p>
                    </div>
                  )}
                  {tutorial === 2 && (
                    <div
                      className="modal_tutorial_content"
                      style={{
                        overflow: 'auto'
                      }}
                    >
                      <p>
                        {' '}
                        All Objects on <span className="highlight">
                          Canvas
                        </span>{' '}
                        have <span className="bold">Free Transform</span>{' '}
                        Feature. Which means you can change their size and angle
                        with your mouse by dragging dots which are located on
                        object edges.
                      </p>
                      <div
                        style={{
                          textAlign: 'left',
                          marginLeft: 32
                        }}
                      >
                        You can change the position of an object on{' '}
                        <span className="highlight">Canvas</span> by:
                        <p
                          style={{
                            marginLeft: 30
                          }}
                        >
                          1. Using Your Mouse. Just Hold left click on any
                          object space and move it.
                        </p>
                        <p
                          style={{
                            marginLeft: 30
                          }}
                        >
                          2. Using <span className="key">←</span>
                          <span className="key">→</span>
                          <span className="key">↓</span>
                          <span className="key">↑</span> Keys on Keyboard. Using
                          <span className="key">shift</span> with arrow keys
                          will change object position by 20 units on canvas.
                        </p>
                      </div>
                      <div
                        style={{
                          textAlign: 'left',
                          marginLeft: 32
                        }}
                      >
                        You can Scale or Rotate any object on Canvas by using:
                        <p
                          style={{
                            marginLeft: 30
                          }}
                        >
                          1. Mouse - by using blue dots which are located on
                          every object. If you hold
                          <span className="key">shift</span>
                          key while doing{' '}
                          <span className="bold">Free Transform</span> operation
                          ( like scaling or rotation) - object will change size
                          with saved aspect ratio. Holding
                          <span className="key">alt</span>
                          key during{' '}
                          <span className="bold">Free Transform</span> operation
                          will change size in both direction (left-right or
                          up-down). You can combine{' '}
                          <span className="key">shift</span> and
                          <span className="key">alt</span>
                          keys by using them together
                          <span className="key">shift</span>+
                          <span className="key">alt</span>. Holding
                          <span className="key">shift</span> key for rotate
                          operation will change object angle by 15 units
                        </p>
                        <img
                          style={{
                            width: '59%'
                          }}
                          className="gif"
                          src={require('../assets/img/Free_transform.gif')}
                          alt="frameSelection"
                        />
                        <div
                          style={{
                            marginLeft: 30
                          }}
                        >
                          2. Bottom Control Panel. Here you can change average
                          size of object and angle. Also you can change Color
                          for your frame or text.{' '}
                          <p className="note">
                            Note: Double-click on slider circle will return
                            value to default
                          </p>
                        </div>
                        <img
                          style={{
                            width: '59%'
                          }}
                          className="gif"
                          src={require('../assets/img/Bot_pan.gif')}
                          alt="frameSelection"
                        />
                      </div>
                    </div>
                  )}
                  {tutorial === 3 && (
                    <div className="modal_tutorial_content">
                      <p>
                        Layer system in MonogramMaker allow you to create
                        multiple frames/texts and combine them together on one
                        <span className="highlight">Canvas</span>!
                      </p>
                      <div
                        style={{
                          textAlign: 'left',
                          marginLeft: 32
                        }}
                      >
                        There are two ways to create{' '}
                        <span className="highlight">Layer</span>:
                        <p
                          style={{
                            marginLeft: 30
                          }}
                        >
                          1. New layer will be created automatically if you have
                          no layer selected and select frame or type text in{' '}
                          <span className="highlight">Sidebar</span>.
                        </p>
                        <p
                          style={{
                            marginLeft: 30
                          }}
                        >
                          2. By clicking{' '}
                          <span className="highlight">Add New Layer</span>{' '}
                          button
                        </p>
                      </div>
                      <div
                        style={{
                          textAlign: 'left',
                          marginLeft: 32
                        }}
                      >
                        With Layer System You can:
                        <p
                          style={{
                            marginLeft: 30
                          }}
                        >
                          1. <span className="bold">Rename Layer</span> with
                          mouse right click on{' '}
                          <span className="highlight">Layer</span> which you
                          want to rename.
                        </p>
                        <p
                          style={{
                            marginLeft: 30
                          }}
                        >
                          2. <span className="bold">Change Layer Order</span> -
                          which will change their draw order on{' '}
                          <span className="highlight">Canvas</span> (rule - top
                          one layer is the top one drawn on canvas).
                        </p>
                        <p
                          style={{
                            marginLeft: 30
                          }}
                        >
                          3. <span className="bold">Delete Layer</span>.
                        </p>
                      </div>
                      <img
                        style={{
                          width: '25%'
                        }}
                        className="gif"
                        src={require('../assets/img/Layers.gif')}
                        alt="frameSelection"
                      />
                    </div>
                  )}
                  <footer className="modal_footer">
                    <div className="modal_footer_buttons">
                      <button
                        className="step blue "
                        onClick={() =>
                          this.handleSetTutorial(
                            tutorial === 1 ? undefined : tutorial - 1
                          )
                        }
                      >
                        <i className="fas fa-arrow-left" /> Back
                      </button>
                      <button
                        className={tutorial === 3 ? 'step green' : 'step blue'}
                        onClick={() => {
                          if (tutorial === 3) {
                            this.handleClose();
                          } else {
                            this.handleSetTutorial(
                              tutorial < 3 ? tutorial + 1 : 1
                            );
                          }
                        }}
                      >
                        {tutorial === 3 ? (
                          'Finish Tutorial (3/3)'
                        ) : (
                          <span> Next Tutorial ({tutorial}/3)</span>
                        )}
                      </button>
                    </div>
                  </footer>
                </div>
              )}
            </section>
          </Rodal>
        </Portal>
      </Fragment>
    );
  }
}

export default HelpModal;
