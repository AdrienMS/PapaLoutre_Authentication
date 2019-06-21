function bodyLogin(req) {
    if (
        (req.body.email === null || req.body.email === undefined)
        && (req.body.username === null || req.body.username === undefined)
    ) {
        return { status: 400, message: 'You have to send email or username' };
    }

    return null;
}

function bodyRegister(req) {
    if (req.body.email === null || req.body.email === undefined) {
        return { status: 400, message: 'You have to send email' };
    }
    if (req.body.username === null || req.body.username === undefined) {
        return { status: 400, message: 'You have to send username' };
    }

    return null;
}

function checkBody(req, isLogin) {
    let error = null;
    if (req.body.password === null || req.body.password === undefined) {
        error = { status: 400, message: 'You have to send password' };
    }

    if (isLogin) {
        const e = bodyLogin(req);
        if (e != null) { error = e; }
    } else {
        const e = bodyRegister(req);
        if (e != null) { error = e; }
    }

    return error === null ? { success: true } : { success: false, err: error };
}

module.exports = checkBody;
