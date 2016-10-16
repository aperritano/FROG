import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Quiz from './Quiz.jsx';


/*
Class used for the form to be dynamic and change when the user chooses between the different types
*/
export default class ActivityType extends Component {

	constructor(props) {
		super(props);

    this.state = {
      lectureURL:"",
      videoURL:"",
      nbQuestions:0,
      listQuiz:[],
    }
  }

  //To avoid problems with unbounded number of quizzes
  tooManyQuiz() {
    return this.state.listQuiz.length >= 20;
  }

  enoughQuiz() {
    return this.state.listQuiz.length > 0;
  }

  haveFieldsCompleted() {
    switch (this.props.type) {

      case this.props.LECTURE_TYPE:
      return this.state.lectureURL !== "";

      case this.props.VIDEO_TYPE:
      return this.state.videoURL !== "";

      case this.props.QUIZ_TYPE:
			var lQuiz = this.state.listQuiz;
      var quizzesFieldsCompleted = (lQuiz.length !== 0);

      lQuiz.forEach((ref) => {
        var quiz = (this.refs[ref]);
        quizzesFieldsCompleted = quizzesFieldsCompleted && quiz.haveFieldsCompleted();
      });

      return quizzesFieldsCompleted;

      default:
        return false; //If we don't know what type it is, we can't submit
      }
    }

    areAnswersInChoices() {

      var answersInChoices = true;

      if(this.props.type === this.props.QUIZ_TYPE) {

        this.state.listQuiz.forEach((ref) => {
          var quiz = (this.refs[ref]);
          answersInChoices = answersInChoices && quiz.isAnswerInChoices();
        });

      }

      return answersInChoices;
    }

  //Used to create a quiz, when create button is hit. Creates only in the end of the list of quizzes.
  createQuiz(event) {
    event.preventDefault();

    if(!this.tooManyQuiz()) {
      var allQuiz = this.state.listQuiz.concat((this.props.QUIZ_TYPE + this.state.listQuiz.length));
      this.setState({listQuiz:allQuiz, nbQuestions: this.state.nbQuestions + 1});
    }

  }

  //Once requested, this component generates the sub-form answer
  generateAnswers() {
    switch (this.props.type) {
      case this.props.LECTURE_TYPE:
      return ({path: this.state.lectureURL});

      case this.props.VIDEO_TYPE:
      return ({url: this.state.videoURL});

      case this.props.QUIZ_TYPE:
      return (this.generateQuizAnswers());

      default:
      return("");
    }
  }

  //Once requested, this component generates the form answer of all quizzes
  generateQuizAnswers() {

    var questions = this.state.listQuiz.map((ref) => {
      var quiz = (this.refs[ref]);
      return quiz.generateQuiz();
    });

    return questions;
  }

  renderAllQuiz() {
    return(
      <div>
      {this.state.listQuiz.map((ref, i) =>
				<Quiz ref={ref} key={ref} id={i}/>)}
      </div>
      );
  }

	//Keep only the unselected quizzes
	cleanQuizList(event) {
		event.preventDefault();

		var newListQuiz = this.state.listQuiz.filter((ref) =>{
			var quiz = (this.refs[ref]);
			return !quiz.isSelected();
		});

		this.setState({listQuiz: newListQuiz});
	}

  handleVideoOrURLChange(event) {
    event.preventDefault();
    this.setState({lectureURL:event.target.value.trim()});
    this.setState({videoURL:event.target.value.trim()});
  }

  //Renders according to the type given in the props
  renderType() {
    switch (this.props.type) {
      case this.props.LECTURE_TYPE:
      return (
        <div>
	        <input
		        type="text"
		        ref ="lectureURL"
		        placeholder="Enter the path"
		        onChange={this.handleVideoOrURLChange.bind(this)}
		        onSubmit={this.handleVideoOrURLChange.bind(this)} /><br/>
        </div>
        );

      case this.props.VIDEO_TYPE:
      return (
        <div>
	        <input
		        type="text"
		        ref ="videoPath"
		        placeholder="Enter the Youtube URL"
		        onChange={this.handleVideoOrURLChange.bind(this)}
		        onSubmit={this.handleVideoOrURLChange.bind(this)} /><br/>
        </div>
        );

      case this.props.QUIZ_TYPE:
      return (
        <div >
	        <button
		        type="submit"
		        onClick={this.createQuiz.bind(this)}
		        disabled={this.tooManyQuiz()}>Create new Question</button>
		        {this.renderAllQuiz()}
					<button
						type="delete"
						onClick={this.cleanQuizList.bind(this)}
						disabled={!this.enoughQuiz()}>Delete selected Questions</button>
        </div>
        );

      default:
      return("");
    }

  }

  render() {
    return(
      <div>
      {this.renderType()}
      </div>
      )
  }


}
