const watch = {
    "selectedCreate.type": {
        immediate: true,
        deep: true,
        handler(newValue, oldValue) {
            if (newValue == 'theory') {
                document.getElementById('theoryCol').style.display = "block";
                document.getElementById('practiceCol').style.display = "none";
                document.getElementById('seminarCol').style.display = "none";
                if (this.selectedCreate.editSubject != null) {
                    document.getElementById('theoryColEdit').style.display = "block";
                    document.getElementById('practiceColEdit').style.display = "none";
                    document.getElementById('seminarColEdit').style.display = "none";
                }
            }
            else if (newValue == 'practice') {
                document.getElementById('theoryCol').style.display = "none";
                document.getElementById('practiceCol').style.display = "block";
                document.getElementById('seminarCol').style.display = "none";
                if (this.selectedCreate.editSubject != null) {
                    document.getElementById('theoryColEdit').style.display = "none";
                    document.getElementById('practiceColEdit').style.display = "block";
                    document.getElementById('seminarColEdit').style.display = "none";
                }
            }
            else if (newValue == 'seminar') {
                document.getElementById('theoryCol').style.display = "none";
                document.getElementById('practiceCol').style.display = "none";
                document.getElementById('seminarCol').style.display = "block";
                if (this.selectedCreate.editSubject != null) {
                    document.getElementById('theoryColEdit').style.display = "none";
                    document.getElementById('practiceColEdit').style.display = "none";
                    document.getElementById('seminarColEdit').style.display = "block";
                }
            }
        }
    },
}

export default watch