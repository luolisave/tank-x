module.exports = {
    check: function (socketId, playerIndex, playerAngle, playerVelocity, tanks) { 
        // playerAngle: 0 up, -180 down, -90 left, 90 right

        // console.log('TODO: detect collistion.', socketId, ' playerIndex =', playerIndex);
        // this.checkTankAgainstTank();
        return false;
    },
    checkTankAgainstBullets: function () {
        // TODO: checkTankAgainstBullets()
        return false;
    },
    checkTankAgainstTank: function (socketId, playerIndex, playerAngle, playerVelocity, tanks) {
        // TODO: checkTankAgainstTank()
        return false;
    }
};
