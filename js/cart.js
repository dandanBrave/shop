/**
 * Created by Administrator on 2017/7/19.
 */
var vm = new Vue({
    el:"#app",
    data:{
        totalMoney:0,
        productList:[],
        checkAllFlag:false,
        delFlag:false
    },
    filters:{
        formatMoney:function (value) {
            return '￥'+ value.toFixed(2);
        }
    },
    mounted:function () {
        this.cartView();
    },
    methods:{
        cartView:function () {
            var _this = this;
            this.$http.get("data/cartData.json",{'id':123}).then(function (res) {
                _this.productList = res.data.result.list;
            });
        },
        changeMoney:function ( product, way ) {
            if(way>0){
                product.productQuantity++;
            }else {
                product.productQuantity--;
                if(product.productQuantity<1) product.productQuantity=1
            }
            this.calcTotalPrice(); // 点击加减也执行计算总金额的方法
        },
        selectedProduct:function (item) {
            if(typeof item.checked == 'undefined'){
                Vue.set(item,"checked",true);
            }else{
                item.checked = !item.checked;
            }
            this.calcTotalPrice();
        },
        checkAll:function (flag) {
            this.checkAllFlag = flag;
            var _this=this;
            this.productList.forEach(function (item,index) {
                if(typeof item.checked == 'undefined'){
                    _this.set(item,'checked',this.checkAllFlag);  // 全局注册 往item注册一个checked 值为true
                        // this.$set(item,'checked',true);//局部注册 加$
                }else {
                    item.checked = _this.checkAllFlag; // 有了之后 点击是false
                }
            });
            this.calcTotalPrice();
        },
        calcTotalPrice:function () {
            var _this = this;
            this.totalMoney = 0;
            this.productList.forEach(function (item,index) {
                if(item.checked){
                   _this.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        },
        delConfirm:function (item) {
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct :function () {
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index,1);
            this.delFlag = false;
        }
    }
});
Vue.filter("money",function (value,type) {
    return '￥'+ value.toFixed(2) + type;
})