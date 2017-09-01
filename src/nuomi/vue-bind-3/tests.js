

describe('事件传播测试',function(){
  it("简单的无嵌套对象",function(){
    let app1 = new Observer({
      name: 'youngwind',
      age: 25
    });
    let s = sinon.spy();
    app1.$watch('age', s);
    app1.data.age = 100;
    s.should.be.calledWith(100);
  })

  it("嵌套对象",function(){
    let app2 = new Observer({
      name:{
        firstName:"Ezio",
        lastName:"Shiki"
      },
      age:12
    })

    let spy1 = sinon.spy();
    app2.$watch('name', spy1);

    let spy2 = sinon.spy();
    app2.data.name.$watch('firstName', spy2);

    let spy3 = sinon.spy();
    app2.data.name.$watch('lastName', spy3);

    let spy4 = sinon.spy();
    app2.$watch('age',spy4);

    app2.data.name.firstName = "Xi";

    spy2.should.be.calledWith("Xi");
    spy1.should.be.calledWith("Xi");
    spy3.should.not.be.called();
    spy4.should.not.be.called();


    //FIXME: 这里会出错，因为直接新创建了一个属性app2.data.name，而不是原来就有name
    //这样不会经过setter，也就不能构造成Observer了……
    // let app2 = new Observer({
    //   age:12
    // })
    // app2.data.name = {
    //   firstName:"Ezio",
    //   lastName:"Shiki"
    // }
    // app2.$watch('name', e=> {
    //   console.log("====")
    //   console.log(e);
    //   console.log("name")
    //   console.log("========")
    // });
    // app2.data.name.$watch('firstName', e=>{
    //   console.log("====")
    //   console.log(e);
    //   console.log("firstname")
    //   console.log("========")
    // });
  })

  it("后添加嵌套对象",function(){
    let app3 = new Observer({
      name:"Fuck",
      age:12
    })

    app3.data.name = {
      firstName:"Ezio",
      lastName:"Shiki"
    }

    let spy1 = sinon.spy();
    app3.$watch('name', spy1);

    let spy2 = sinon.spy();
    app3.data.name.$watch('firstName', spy2);

    let spy3 = sinon.spy();
    app3.data.name.$watch('lastName', spy3);

    let spy4 = sinon.spy();
    app3.$watch('age',spy4);

    app3.data.name.firstName = "Xi";

    spy2.should.be.calledWith("Xi");
    spy1.should.be.calledWith("Xi");
    spy3.should.not.be.called();
    spy4.should.not.be.called();


  })
})