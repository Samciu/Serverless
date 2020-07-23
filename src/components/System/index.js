import React, { Component } from 'react';

class System extends Component {

    state = {
        buttonDisabled: true,
        list: [],
        name: "",
        age: "",
        avatarUrl: ""
    }

    componentDidMount() {
        this.setbuttonDisabled(true)
        this.signIn()
    }

    setbuttonDisabled(status) {
        this.setState({
            buttonDisabled: status
        })
        if (!status) {
            this.queryData()
        }
    }

    // 匿名登录
    signIn() {
        const { app } = this.props;
        const auth = app.auth({
            persistence: "local"
        })
        if (!auth.hasLoginState()) {
            auth.signInAnonymously().then(() => {
                this.setbuttonDisabled(false)
            })
        } else {
            this.setbuttonDisabled(false)
        }
    }

    // 查询信息
    queryData() {
        const { app } = this.props;
        const coll = app.database().collection("test_db")

        coll.where({}).get().then((res) => {

            if (res.code) {
                console.log("数据库查询失败", res)
                // 打印数据库查询失败的信息
                window.alert(
                    "成绩查询失败: [code=" + res.code + "] [message=" + res.message + "]"
                )
            } else {
                console.log("数据库查询成功", res)
                // 打印数据库查询结果
                this.setState({
                    list: res.data
                })
            }
        })
    }

    // 录入信息
    addData = () => {
        const { buttonDisabled, name, age, avatarUrl } = this.state;
        const { app } = this.props;
        if (buttonDisabled) return;

        const coll = app.database().collection("test_db")

        if (!name) {
            window.alert(
                "姓名不能为空!"
            )
            return
        }
        if (!(age > 0 && age < 200)) {
            window.alert(
                "年龄需要在 0 ~ 200 之间"
            )
            return
        }
        if (!avatarUrl) {
            window.alert(
                "头像不能为空!"
            )
            return
        }

        this.setbuttonDisabled(true)

        coll.add({
            name: name,
            age: parseFloat(age),
            avatar: avatarUrl
        }).then((res) => {

            if (res.code) {
                console.log("数据库新增失败", res)
                // 打印数据库新增失败的信息
                window.alert(
                    "成绩录入失败: [code=" + res.code + "] [message=" + res.message + "]"
                )
            } else {
                console.log("数据库新增成功", res)
                this.setState({
                    avatarUrl: ""
                })
                window.alert(
                    "成绩录入成功!"
                )
            }

            this.setbuttonDisabled(false)
        })
    }

    // 上传头像
    addAvatar = (e) => {
        debugger;
        const { app } = this.props;
        const file = e.target.files[0]
        if (!file) return
        const name = file.name

        app.uploadFile({
            cloudPath: (new Date()).valueOf() + "-" + name,
            filePath: file
        }).then(res => {
            // 云文件ID
            const fileID = res.fileID
            // 通过云文件ID 获取 云文件链接
            app.getTempFileURL({
                fileList: [fileID]
            }).then(res2 => {
                const fileObj = res2.fileList[0]
                const url = fileObj.tempFileURL
                this.setState({
                    avatarUrl: url
                })
            })
        })
    }

    renderTable() {
        const { list } = this.state;
        if (list.length == 0) return null;
        return (
            <table style={{ margin: "0 auto" }}>
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>年龄</th>
                        <th>头像</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map(item => {
                            const { name, age, avatar } = item;
                            return (
                                <tr key={avatar}>
                                    <td>{name}</td>
                                    <td>{age}</td>
                                    <td><img src={avatar} style={{ width: "60px", height: "60px" }} /></td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>
        )
    }

    render() {
        const { name, age } = this.state;
        return (
            <div className="system">
                <header>
                    <h1>CIA 2.0</h1>
                </header>
                <div style={{ padding: "20px 0", border: "solid" }}>
                    <h2>录入信息</h2>
                    <form>
                        <div>姓名: <input id="add-name" value={name} onChange={(e) => { this.setState({ name: e.target.value }) }} /></div>
                        <div>年龄: <input id="add-age" value={age} onChange={(e) => { this.setState({ age: e.target.value }) }} /></div>
                        <div>头像: <input onChange={this.addAvatar} type="file" id="add-avatar" accept=".jpg, .jpeg, .png" style={{ width: "153px" }} /></div>
                        <div id="add-button" onClick={this.addData}>录入</div>
                    </form>
                    <h2>信息列表</h2>
                    <div id="info-box">
                        {this.renderTable()}
                    </div>
                </div>
            </div>
        );
    }
}

export default System;