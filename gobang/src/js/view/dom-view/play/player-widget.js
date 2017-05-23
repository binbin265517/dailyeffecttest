import Widget from '../widget.js';

export default class PlayerWidget extends Widget {
    init(role, isRobot) {
        this.role = role;
        this.isRobot = isRobot;

        let template = this.page.elem.querySelector('#play-player-template').innerHTML;
        let eDiv = document.createElement('div');
        eDiv.innerHTML = template;

        this.ePlayer = eDiv.querySelector('div');
        this.ePlayer.classList.add(role);
        isRobot && this.ePlayer.classList.add('robot');

        this.avatar = this.ePlayer.querySelector('.avatar');

        this.page.elem.appendChild(this.ePlayer);
        this.initEvent();
    }

    initEvent() {
        let thisWidget = this;

        if (this.isRobot) {
            this.ePlayer.removeChild(this.ePlayer.querySelector('.player-handle'));
            return;
        }

        let undoBtn = this.ePlayer.querySelector('.undo-btn');
        let giveinBtn = this.ePlayer.querySelector('.givein-btn');
        let askdrawBtn = this.ePlayer.querySelector('.askdraw-btn');

        undoBtn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) {
                return;
            }
            let eventName = 'undo';
            
            if (this.classList.contains('undoundo')) {
                eventName = 'undoundo'
            }
            thisWidget.trigger(eventName);
        });

        giveinBtn.addEventListener('click', function() {
            thisWidget.trigger('giveIn');
        });

        askdrawBtn.addEventListener('click', function() {
            thisWidget.trigger('askDraw');
        });
    } 

    watch() {
        return {
            avatar: (avatar)=>{
                this.avatar.className = 'avatar ' + avatar;
                this.ePlayer.className = this.ePlayer.className.replace(/bg\-avatar\S*?/g, '');
                this.ePlayer.classList.add('bg-' + avatar);
            },
            pieceType: (pieceType)=>{
                let ePiece = this.ePlayer.querySelector('.piece');
                ePiece.classList.remove('white', 'black');
                ePiece.classList.add(pieceType);
            },
            undoState: (undoState)=>{
                if (this.isRobot) return;
                let undoBtn = this.ePlayer.querySelector('.undo-btn');
                // disabled //undoundo // undo
                undoBtn.classList.remove('disabled', 'undo', 'undoundo');
                undoBtn.innerHTML =  undoState === 'undoundo'? '撤销悔棋': '悔棋';
                undoBtn.classList.add(undoState);
            },
            playerState: (playerState)=>{
                this.ePlayer.classList.remove('playing', 'wait', 'lose', 'win');
                this.ePlayer.classList.add(playerState);
            }
        }
    }


    distory() {
        super.distory();
        this.ePlayer.parentNode.removeChild(this.ePlayer);

        // todo 事件解绑
    }

}