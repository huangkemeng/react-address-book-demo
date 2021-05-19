import React from "react";
import moment from "moment"
import './App.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    var time = moment(new Date()).format('HH:mm:ss')
    this.state = {
      onlineTime: time,
      keyword: '',
      editing: -1,
      editingObj: {
        name: '',
        email: '',
        address: ''
      },
      addresses: [
        {
          name: "Aron",
          email: "aron.wang@perkinelmer.com",
          address: 'Shanghai'
        },
        {
          name: "Bron",
          email: "bron.wang@perkinelmer.com",
          address: 'Shanghai'
        },
        {
          name: "Cron",
          email: "cron.wang@perkinelmer.com",
          address: 'Shanghai'
        }
      ]
    };
  }

  render() {
    return (
      <div className="container">
        <div className="header">
          <div className="title">Address Book</div>
          <div className="time">Online Time:{this.state.onlineTime}</div>
          <button onClick={() => this.addAddressItem()}>Add Address Item</button>
          <button onClick={() => this.sortAddresses('asc')}>A-Z</button>
          <button onClick={() => this.sortAddresses('desc')}>Z-A</button>
          <input placeholder="Enter keyword to search" value={this.state.keyword} onChange={e => this.keywordChange(e)} />
        </div>
        <div className="card-frame">
          {
            this.state.addresses.filter(e => {
              if (this.state.keyword) {
                return this.containString(e.name, this.state.keyword)
                  || this.containString(e.email, this.state.keyword)
                  || this.containString(e.address, this.state.keyword)
              }
              return true;
            }).map((item, index) => {
              return <div key={index} className="card">
                <div className="card-index">
                  <div className="index-word">{item.name ? item.name[0] : ''}</div>
                </div>
                <div className="card-info">
                  <div className="flex prop">
                    <div>Name:</div>
                    <div>Email:</div>
                    <div>Address:</div>
                  </div>
                  {
                    this.state.editing === index ? <div className="flex">
                      <input value={this.state.editingObj.name} onChange={e => this.addressChange(e, 'name')} />
                      <input value={this.state.editingObj.email} onChange={e => this.addressChange(e, 'email')} />
                      <input value={this.state.editingObj.address} onChange={e => this.addressChange(e, 'address')} />
                    </div>
                      : <div className="flex">
                        <div dangerouslySetInnerHTML={{ __html: item.name.replace(new RegExp(`(${this.state.keyword})`, 'gi'), `<span class="search-matches">$&</span>`) }} />
                        <div dangerouslySetInnerHTML={{ __html: item.email.replace(new RegExp(`(${this.state.keyword})`, 'gi'), `<span class="search-matches">$&</span>`) }} />
                        <div dangerouslySetInnerHTML={{ __html: item.address.replace(new RegExp(`(${this.state.keyword})`, 'gi'), `<span class="search-matches">$&</span>`) }} />
                      </div>
                  }
                  <div className="flex operation">
                    {
                      this.state.editing === index ? <button onClick={() => this.addressSave(index)}>Save</button> : <button onClick={() => this.editAddress(index)}>Edit</button>
                    }
                    <button onClick={() => this.deleteAddressItem(index)}>Delete</button>
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    );
  }

  //生命周期事件，组件加载完毕后执行
  componentDidMount() {
    var that = this
    setInterval(() => {
      that.setState({ onlineTime: moment(new Date()).format('HH:mm:ss') })
    }, 1000)
  }

  //输入搜索关键字
  keywordChange(e) {
    var val = e.target.value;
    this.setState(() => {
      return {
        keyword: val
      }
    })
  }

  // 地址保存
  addressSave(index) {
    var addresses = [...this.state.addresses];
    addresses[index] = this.state.editingObj;
    this.setState(() => {
      return {
        addresses: addresses,
        editing: -1
      }
    })
  }
  //地址更改
  addressChange(e, prop) {
    this.setState(prevState => {
      var obj = prevState.editingObj
      obj[prop] = e.target.value
      return {
        editingObj: obj
      }
    })
  }


  // 判断是否包含字符串
  containString(originString, keyword) {
    if (originString === keyword) {
      return true;
    }
    if (!originString || !keyword) {
      return false
    }
    return originString.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) > -1
  }

  // 对地址排序
  sortAddresses(by) {
    this.setState(prevState => {
      var sortedAddresses = prevState.addresses;
      if (by === 'asc') {
        sortedAddresses = this.sortByAsc(prevState.addresses)
      }
      else if (by === 'desc') {
        sortedAddresses = this.sortByDesc(prevState.addresses)
      }
      return {
        addresses: sortedAddresses
      }
    }
    )
  }

  //编辑地址
  editAddress(index) {
    var address = this.state.addresses[index];
    var currentEditingObj = Object.assign(address, {})
    this.setState(() => {
      return {
        editing: index,
        editingObj: currentEditingObj
      }
    })
  }

  //倒序
  sortByDesc(addresses) {
    return addresses.sort((a, b) => {
      if (a.name > b.name) {
        return -1;
      } else if (a.name < b.name) {
        return 1;
      }
      else {
        return 0;
      }
    });
  }

  //顺序
  sortByAsc(addresses) {
    return addresses.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }
      else {
        return 0;
      }
    });
  }

  // 增加地址
  addAddressItem() {
    var obj = {
      name: '',
      email: '',
      address: ''
    };

    this.setState(prevState => (
      {
        addresses: [...prevState.addresses, obj]
      }
    ))
  }

  //删除地址项
  deleteAddressItem(index) {
    var addresses = [...this.state.addresses]
    addresses.splice(index, 1);
    this.setState(() => (
      {
        addresses: addresses,
        editing: -1
      }
    ))
  }
}

export default App;
