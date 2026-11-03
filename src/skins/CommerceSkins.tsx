import {
  Home,
  MapPin,
  Receipt,
  ShoppingBag,
  Star,
  Ticket,
  Truck,
  Utensils,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Empty,
  Header,
  Media,
  meta,
  SearchBox,
  Tabs,
  useContent,
  type Props,
} from "./shared";
export function AlipaySkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "账单");
  const list =
    tab === "卡包"
      ? items.filter((i) => i.folder === "卡包" || i.folder === "票券")
      : items.filter((i) => !["卡包", "票券"].includes(i.folder));
  return (
    <div className="catalog-skin alipay-ui">
      <Header p={p} />
      <div className="alipay-blue">
        <h2>{tab}</h2>
        <div>
          <button onClick={() => setTab("账单")}>
            <Receipt size={28} />
            账单
          </button>
          <button onClick={() => setTab("卡包")}>
            <Ticket size={28} />
            卡包
          </button>
        </div>
        <small>作品内的虚构支付记录</small>
      </div>
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {list.map((i) =>
          tab === "卡包" ? (
            <button
              className="alipay-ticket"
              key={i.id}
              onClick={() => p.onItem(i)}
            >
              <Ticket size={23} />
              <div>
                <strong>{i.title}</strong>
                <p>{i.body}</p>
                <small>{i.time}</small>
              </div>
            </button>
          ) : (
            <button
              className="alipay-bill"
              key={i.id}
              onClick={() => p.onItem(i)}
            >
              <Wallet size={27} />
              <div>
                <strong>{i.title}</strong>
                <small>
                  {meta(i, "merchant", i.sender)} · {i.time.slice(5, 16)}
                </small>
              </div>
              <span>
                <strong>{meta(i, "amount", "—")}</strong>
                <small>{meta(i, "status", "账单记录")}</small>
              </span>
            </button>
          ),
        )}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["账单", "卡包"]}
        value={tab}
        set={setTab}
        icons={[<Receipt />, <Ticket />]}
      />
    </div>
  );
}
export function TaobaoSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "商品");
  const [status, setStatus] = useState("全部");
  const [selected, setSelected] = useState<import("../schema").Item|null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentStep, setPaymentStep] = useState(false);
  const list = items
    .filter((i) =>
      tab === "商品"
        ? i.folder !== "订单" && i.folder !== "物流"
        : i.folder === tab,
    )
    .filter((i) => status === "全部" || meta(i, "status") === status);
  return (
    <div className="catalog-skin taobao-ui">
      <Header p={p} />
      <div className="taobao-search">
        <SearchBox value={q} set={setQ} placeholder="搜索商品或订单" />
      </div>
      <div className="catalog-scroll">
        {tab === "商品" ? (
          <div className="taobao-products">
            {list.map((i) => (
              <button key={i.id} onClick={() => {setSelected(i);setQuantity(1);setPaymentStep(false);}}>
                <Media item={i} />
                <strong>{i.title}</strong>
                <p>
                  ¥ <b>{meta(i, "price", "—")}</b>
                </p>
                <small>{i.sender}</small>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="taobao-status">
              {["全部", "待付款", "待发货", "待收货", "已完成"].map((s) => (
                <button
                  className={s === status ? "selected" : ""}
                  key={s}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {list.map((i) => (
              <button
                className="taobao-order"
                key={i.id}
                onClick={() => p.onItem(i)}
              >
                <div>
                  <ShoppingBag size={16} />
                  <strong>{i.sender}</strong>
                  <small>{meta(i, "status", "订单记录")}</small>
                </div>
                <section>
                  <Media item={i} />
                  <span>
                    <strong>{i.title}</strong>
                    <p>
                      {tab === "物流" ? meta(i, "tracking", i.body) : i.body}
                    </p>
                    <b>¥ {meta(i, "price", "—")}</b>
                  </span>
                </section>
                <footer>{meta(i, "number", i.time)}</footer>
              </button>
            ))}
          </>
        )}
        <Empty items={list} />
      </div>
      {selected && (
        <div className="taobao-buy-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section className="taobao-buy-sheet" role="dialog" aria-modal="true" aria-label="商品购买" onClick={e => e.stopPropagation()}>
            <button className="taobao-buy-close" onClick={() => {setSelected(null);setPaymentStep(false);}}>×</button>
            <Media item={selected} />
            {paymentStep ? <div className="alipay-checkout-head"><strong>支付宝</strong><small>确认付款</small><b>¥ {(Number(meta(selected,"price","0"))*quantity).toFixed(2)}</b><span>付款方式：账户余额</span></div> : <div className="taobao-buy-info">
              <strong>{selected.title}</strong>
              <p>{selected.body}</p>
              <b>¥ {meta(selected,"price","0")}</b>
            </div>}
            {!paymentStep && <div className="taobao-quantity">
              <span>购买数量</span>
              <div>
                <button aria-label="减少数量" disabled={quantity<=1} onClick={()=>setQuantity(v=>Math.max(1,v-1))}>−</button>
                <strong>{quantity}</strong>
                <button aria-label="增加数量" onClick={()=>setQuantity(v=>Math.min(99,v+1))}>＋</button>
              </div>
            </div>}
            {!paymentStep && <div className="taobao-payment-row"><span>支付方式</span><strong>支付宝余额　›</strong></div>}
            {!paymentStep && <div className="taobao-total"><span>合计</span><b>¥ {(Number(meta(selected,"price","0"))*quantity).toFixed(2)}</b></div>}
            {paymentStep ? <button className="taobao-pay-button" onClick={() => {window.dispatchEvent(new CustomEvent("foundphone:purchase",{detail:{item:selected,quantity}}));setSelected(null);setPaymentStep(false);setTab("订单");setStatus("全部");}}>支付</button> : <button className="taobao-pay-button" onClick={() => setPaymentStep(true)}>去支付宝支付</button>}
            <small className="taobao-pay-note">模拟购买 · 不会产生真实扣款</small>
          </section>
        </div>
      )}
      <Tabs
        tabs={["商品", "订单", "物流"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setStatus("全部");
        }}
        icons={[<Home />, <ShoppingBag />, <Truck />]}
      />
    </div>
  );
}
export function DeliverySkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "商家");
  const list = items.filter((i) =>
    tab === "订单" ? i.folder === "订单" : i.folder !== "订单",
  );
  return (
    <div className="catalog-skin delivery-ui">
      <Header p={p} />
      <div className="delivery-location">
        <MapPin size={18} />
        <strong>{meta(items[0], "address", "作品配送地址")}</strong>
      </div>
      <SearchBox value={q} set={setQ} placeholder="搜索商家或订单" />
      <div className="catalog-scroll">
        {tab === "商家"
          ? list.map((i) => (
              <button
                className="delivery-merchant"
                key={i.id}
                onClick={() => p.onItem(i)}
              >
                <Media item={i} />
                <div>
                  <h3>{i.title}</h3>
                  <p>
                    <Star size={12} />
                    {meta(i, "rating", "—")}
                    <span>{meta(i, "duration")}</span>
                  </p>
                  <small>{i.body.split("\n")[0]}</small>
                  <strong>¥ {meta(i, "price", "—")}</strong>
                </div>
              </button>
            ))
          : list.map((i) => (
              <button
                className="delivery-order"
                key={i.id}
                onClick={() => p.onItem(i)}
              >
                <header>
                  <Utensils size={18} />
                  <strong>{i.sender}</strong>
                  <span>{meta(i, "status", "配送记录")}</span>
                </header>
                <section>
                  <Media item={i} />
                  <div>
                    <strong>{i.title}</strong>
                    <p>{i.body}</p>
                    <small>{i.time}</small>
                  </div>
                  <b>¥ {meta(i, "price", "—")}</b>
                </section>
                <footer>
                  <MapPin size={13} />
                  {meta(i, "address")}
                </footer>
              </button>
            ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["商家", "订单"]}
        value={tab}
        set={setTab}
        icons={[<Utensils />, <Receipt />]}
      />
    </div>
  );
}
