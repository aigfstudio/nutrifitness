import { useState } from "react"

const R="#c8102e",BK="#111",GR="#f5f5f5",BDR="#e5e5e5"

const CATS=[
  {name:"Protein",abbr:"PRO",bg:"#1a3a6b",count:234},
  {name:"Pre-Workout",abbr:"PRE",bg:"#0a0a1a",count:156},
  {name:"Vitamins",abbr:"VIT",bg:"#0a4a2a",count:389},
  {name:"Weight Loss",abbr:"FAT",bg:"#c8102e",count:178},
  {name:"Keto",abbr:"KET",bg:"#3a1a6b",count:89},
  {name:"Women's Health",abbr:"WMN",bg:"#6b1a3a",count:145},
  {name:"Men's Health",abbr:"MEN",bg:"#1a4a1a",count:112},
  {name:"Energy",abbr:"NRG",bg:"#4a3a00",count:67},
  {name:"Recovery",abbr:"REC",bg:"#003a4a",count:94},
  {name:"Herbs & Naturals",abbr:"HRB",bg:"#1a3a1a",count:203},
  {name:"Food & Snacks",abbr:"SNK",bg:"#4a2a00",count:312},
  {name:"Sports Perf.",abbr:"SPT",bg:"#2a2a4a",count:167},
  {name:"Immune Support",abbr:"IMM",bg:"#00334a",count:98},
  {name:"Brain & Focus",abbr:"BRN",bg:"#2a003a",count:76},
  {name:"Digestion",abbr:"DIG",bg:"#1a4a2a",count:54},
  {name:"Beauty & Skin",abbr:"BEA",bg:"#4a002a",count:43},
  {name:"Kids' Health",abbr:"KID",bg:"#6b3a00",count:28},
  {name:"Senior Health",abbr:"SEN",bg:"#003a2a",count:34},
]

const PRODS=[
  {id:1,brand:"UNIVERSAL NUTRITION",name:"Animal Creatine Chews - Candy Crush'd",sub:"120 Chewable Tablets (30 Servings)",price:36.99,orig:null,rating:5,reviews:205,badge:"New Flavor",bc:"#00704a",bg:"#1a1a3a",cat:"Pre-Workout",inCart:1985},
  {id:2,brand:"GNC PRO PERFORMANCE®",name:"Creatine Monohydrate",sub:"50 Servings",price:24.99,orig:null,rating:4.5,reviews:82,badge:"BOGO 50%",bc:"#006400",bg:"#c8102e",cat:"Protein",inCart:null},
  {id:3,brand:"CREATE WELLNESS",name:"Creatine Monohydrate Gummies - Blue Raspberry",sub:"45 Gummies (15 Servings)",price:24.99,orig:null,rating:3.5,reviews:32,badge:"Best Seller",bc:"#003087",bg:"#1a3a6b",cat:"Vitamins",inCart:null},
  {id:4,brand:"GNC PRO PERFORMANCE®",name:"L-Carnitine 500mg - 60 Tablets",sub:"60 Servings",price:19.99,orig:39.99,rating:4.5,reviews:10,badge:"LAST CHANCE! 75% OFF",bc:"#c8102e",bg:"#2a2a2a",cat:"Weight Loss",inCart:1985},
  {id:5,brand:"AXE & SLEDGE SUPPLEMENTS™",name:"Whey More - Christmas Cookie",sub:"30 Servings",price:37.97,orig:54.99,rating:5,reviews:126,badge:"25% off",bc:"#6b21a8",bg:"#1a0a2a",cat:"Protein",inCart:null},
  {id:6,brand:"GNC BEYOND RAW®",name:"LIT Pre-Workout - Gummy Worm",sub:"30 Servings",price:44.99,orig:null,rating:4.5,reviews:334,badge:"Best Seller",bc:"#003087",bg:"#0a2a0a",cat:"Pre-Workout",inCart:null},
  {id:7,brand:"OPTIMUM NUTRITION",name:"Gold Standard 100% Whey - Vanilla",sub:"5 lbs (74 Servings)",price:89.99,orig:109.99,rating:4.5,reviews:1203,badge:"Top Rated",bc:"#8B4513",bg:"#2a1a00",cat:"Protein",inCart:null},
  {id:8,brand:"CELLUCOR",name:"C4 Original Pre-Workout - Fruit Punch",sub:"30 Servings",price:32.99,orig:null,rating:4,reviews:456,badge:null,bc:R,bg:"#3a0a0a",cat:"Pre-Workout",inCart:null},
  {id:9,brand:"MUSCLETECH",name:"Platinum 100% Creatine",sub:"400g (80 Servings)",price:18.99,orig:29.99,rating:4,reviews:278,badge:"37% OFF",bc:"#d4a017",bg:"#1a1a00",cat:"Protein",inCart:null},
]

const BLOGS=[
  {id:1,title:"Best Fall Flavored Workout Supplements of 2025",excerpt:"Shake up your typical pre-workout supplement with this list of the best pre-workout flavors out there. Now go crush your goals with taste.",date:"September 15, 2025",author:"Rachel Baker",cat:"Pre-workout",bg:"#8B1A1A"},
  {id:2,title:"Q&A With the Product Formulator – Beyond Raw LIT V2",excerpt:"GNC's Beyond Raw line of products have become a household name, thanks to the brand's initial launch of LIT Pre-Workout...",date:"August 1, 2025",author:"Rachel Baker",cat:"Pre-workout",bg:"#1A1A4A"},
  {id:3,title:"Best Hydration and Electrolyte Supplements of 2025",excerpt:"Whether you're pounding the pavement on a long run, or pushing through an intense lifting session, staying properly hydrated is key.",date:"July 11, 2025",author:"Rachel Baker",cat:"Sports & Fitness",bg:"#0A3A2A"},
  {id:4,title:"GR8 ULTIM8: Product Deep Dive",excerpt:"Holly Bathurst is the Director of Research & Development at Nutrablend Foods. True wellness doesn't follow trends—it leads them.",date:"May 7, 2025",author:"Holly Bathurst",cat:"Protein",bg:"#0A0A3A"},
  {id:5,title:"Best Running Supplements for Endurance Athletes",excerpt:"Long-distance running demands more from your body. Discover what the pros are taking to go the distance and perform at peak.",date:"April 22, 2025",author:"Rachel Baker",cat:"Sports & Fitness",bg:"#2A0A0A"},
  {id:6,title:"HMB: What You Should Know from a Fitness Expert",excerpt:"HMB is one of the most researched and misunderstood supplements in the fitness industry. Here's what the science actually says.",date:"March 15, 2025",author:"Dr. Mike Chen",cat:"Expert Education",bg:"#1A2A0A"},
  {id:7,title:"Best Holiday Flavored Workout Supplements",excerpt:"From pumpkin spice protein to peppermint pre-workout, the holidays bring some of the most crave-worthy supplement flavors of the year.",date:"December 1, 2024",author:"Rachel Baker",cat:"Pre-workout",bg:"#0A2A1A"},
  {id:8,title:"Best Pre-Workouts of 2025 — Our Ranked List",excerpt:"We tested dozens of pre-workout formulas this year. Here's our definitive ranked list of the best options for every training goal.",date:"January 5, 2025",author:"Rachel Baker",cat:"Pre-workout",bg:"#2A2A0A"},
  {id:9,title:"How to Choose the Right Protein Powder for Your Goals",excerpt:"Whey, casein, plant-based — with so many protein powder options, how do you choose? Our nutrition experts break it all down simply.",date:"February 18, 2025",author:"Dr. Sarah Mills",cat:"Protein",bg:"#0A1A2A"},
  {id:10,title:"Top 5 Vitamins for Women Over 40",excerpt:"As women enter their 40s, nutritional needs shift significantly. These five supplements can help maintain energy, bone health and more.",date:"March 30, 2025",author:"Dr. Sarah Mills",cat:"Women's Health",bg:"#2A0A2A"},
]

const FILTER_DATA={
  departments:["Creatine (147)","Shop By Goal (115)","Shop By Format (97)","Featured Products (7)"],
  brand:["Universal Nutrition","GNC Pro Performance","Optimum Nutrition","Cellucor","MuscleTech","Beyond Raw","Axe & Sledge"],
  productType:["Powder","Capsules/Tablets","Gummies","Chews","Liquid","Bars"],
  price:["Under CHF 20","CHF 20 – CHF 40","CHF 40 – CHF 60","Over CHF 60"],
  byGoal:["Build Muscle","Lose Weight","Increase Energy","Improve Recovery","Enhance Focus"],
  ratings:["★★★★★ (5 stars)","★★★★☆ (4+ stars)","★★★☆☆ (3+ stars)"],
  flavor:["Unflavored","Fruit Punch","Blue Raspberry","Chocolate","Vanilla","Watermelon"],
  form:["Powder","Capsule","Tablet","Gummy","Liquid"],
  diet:["Keto","Vegan","Gluten Free","Dairy Free","Non-GMO"],
}

// ─── Tiny helpers ────────────────────────────────────────────────────────────

function Stars({n}){
  return <span>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=Math.round(n)?"#f5a623":"#ddd",fontSize:12}}>★</span>)}</span>
}

function ProductImg({p}){
  return(
    <div style={{background:p.bg||"#1a1a3a",height:190,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{color:"rgba(255,255,255,0.08)",fontSize:100,fontWeight:900,position:"absolute",userSelect:"none",lineHeight:1}}>{p.abbr||p.cat?.charAt(0)||"N"}</div>
      <div style={{background:"rgba(255,255,255,0.95)",width:88,height:124,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1,padding:8,textAlign:"center"}}>
        <div>
          <div style={{fontSize:7,fontWeight:900,color:p.bg||"#1a1a3a",letterSpacing:.5,lineHeight:1.3,textTransform:"uppercase"}}>{p.brand?.split(" ").slice(0,3).join(" ")}</div>
          <div style={{fontSize:8.5,fontWeight:700,color:"#222",marginTop:4,lineHeight:1.3}}>{p.name.split(" ").slice(0,4).join(" ")}</div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({p,onAdd}){
  const[liked,setLiked]=useState(false)
  const disc=p.orig?Math.round((1-p.price/p.orig)*100):null
  return(
    <div style={{background:"#fff",border:`1px solid ${BDR}`,cursor:"pointer",transition:"all .18s",position:"relative",display:"flex",flexDirection:"column"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,0.11)";e.currentTarget.style.transform="translateY(-3px)"}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)"}}>
      <div style={{position:"relative"}}>
        <ProductImg p={p}/>
        {p.badge&&<div style={{position:"absolute",top:8,left:8,background:p.bc||R,color:"#fff",fontSize:9.5,fontWeight:700,padding:"3px 9px",letterSpacing:.4}}>{p.badge}</div>}
        <button onClick={e=>{e.stopPropagation();setLiked(!liked)}}
          style={{position:"absolute",top:8,right:8,background:"#fff",border:`1px solid ${BDR}`,borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,color:liked?R:"#bbb",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {liked?"♥":"♡"}
        </button>
      </div>
      <div style={{padding:"12px 12px 14px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:.9,color:"#999",textTransform:"uppercase",marginBottom:3}}>{p.brand}</div>
        <div style={{marginBottom:3}}><Stars n={p.rating}/><span style={{fontSize:11,color:"#888",marginLeft:4}}>({p.reviews})</span></div>
        {p.inCart&&<div style={{fontSize:10,color:"#555",marginBottom:3}}>🔥 In {p.inCart.toLocaleString()} carts this month</div>}
        <div style={{fontSize:13,fontWeight:600,color:BK,lineHeight:1.35,marginBottom:3,flex:1}}>{p.name}</div>
        <div style={{fontSize:11,color:"#999",marginBottom:8}}>{p.sub}</div>
        {p.badge==="BOGO 50%"&&<div style={{background:"#00704a",color:"#fff",fontSize:10,fontWeight:700,padding:"5px 8px",marginBottom:8}}>BOGO 50% MIX-AND-MATCH</div>}
        <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:10}}>
          {p.orig&&<span style={{fontSize:12,color:"#aaa",textDecoration:"line-through"}}>CHF {p.orig.toFixed(2)}</span>}
          <span style={{fontSize:19,fontWeight:700}}>CHF {p.price.toFixed(2)}</span>
          {disc&&<span style={{fontSize:11,color:"#00704a",fontWeight:700}}>Save {disc}%</span>}
        </div>
        <button onClick={e=>{e.stopPropagation();onAdd()}}
          style={{width:"100%",background:"#fff",border:`1.5px solid ${BK}`,color:BK,padding:"11px",fontSize:12,fontWeight:700,letterSpacing:.8,cursor:"pointer",transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=BK;e.currentTarget.style.color="#fff"}}
          onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color=BK}}>
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function HomePage({nav,setCartCount,setProModal}){
  const[slide,setSlide]=useState(0)
  const slides=[
    {badge:"New Drop 2025",h1:["BUILD YOUR","BEST BODY"],accent:1,sub:"Premium Swiss nutrition. Keto, protein & performance supplements delivered to your door.",cta:"SHOP NOW",cta2:"VIEW KETO RANGE",bg:"#080808"},
    {badge:"Keto Collection",h1:["KETO DONE","DELICIOUSLY"],accent:1,sub:"Croissants, bars & snacks — only 2g net carbs. Taste the lifestyle.",cta:"SHOP KETO",cta2:"SEE RECIPES",bg:"#0d0d0d"},
    {badge:"Limited Deal",h1:["BUY 1 GET 1","FREE PROTEIN"],accent:1,sub:"Mix and match all whey flavours. This week only — don't miss out.",cta:"GRAB THE DEAL",cta2:"VIEW ALL PROTEIN",bg:"#0a0005"},
  ]
  const s=slides[slide]
  return(
    <div>
      {/* Hero Slider */}
      <div style={{background:s.bg,position:"relative",overflow:"hidden",minHeight:300}}>
        <div style={{padding:"48px 28px 52px",maxWidth:620,position:"relative",zIndex:1}}>
          <div style={{background:R,color:"#fff",fontSize:10,fontWeight:700,letterSpacing:2,padding:"4px 12px",display:"inline-block",marginBottom:14,textTransform:"uppercase"}}>{s.badge}</div>
          <h1 style={{fontWeight:900,fontSize:52,color:"#fff",lineHeight:1,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
            {s.h1.map((line,i)=><span key={i} style={{display:"block",color:i===s.accent?R:"#fff"}}>{line}</span>)}
          </h1>
          <p style={{color:"#888",fontSize:13.5,maxWidth:340,marginBottom:24,lineHeight:1.6}}>{s.sub}</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button onClick={()=>nav("products")} style={{background:R,color:"#fff",border:"none",padding:"14px 30px",fontSize:13,fontWeight:700,letterSpacing:.8,cursor:"pointer"}}>{s.cta}</button>
            <button onClick={()=>nav("products")} style={{background:"transparent",color:"#fff",border:"1.5px solid #444",padding:"14px 28px",fontSize:13,fontWeight:700,letterSpacing:.8,cursor:"pointer"}}>{s.cta2}</button>
          </div>
        </div>
        <div style={{position:"absolute",right:-80,top:-80,width:340,height:340,border:"70px solid rgba(200,16,46,0.07)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",right:60,bottom:-60,width:200,height:200,border:"40px solid rgba(200,16,46,0.05)",borderRadius:"50%"}}/>
        {/* Slide nav */}
        <div style={{position:"absolute",bottom:16,left:28,display:"flex",gap:8}}>
          {slides.map((_,i)=>(
            <button key={i} onClick={()=>setSlide(i)}
              style={{width:i===slide?28:8,height:8,borderRadius:4,background:i===slide?R:"rgba(255,255,255,0.3)",border:"none",cursor:"pointer",transition:"all .3s"}}/>
          ))}
        </div>
        <button onClick={()=>setSlide(s=>(s-1+slides.length)%slides.length)}
          style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <button onClick={()=>setSlide(s=>(s+1)%slides.length)}
          style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>

      {/* Category strip */}
      <div style={{background:"#fff",padding:"24px 20px",borderBottom:`1px solid ${BDR}`}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,maxWidth:1100,margin:"0 auto"}}>
          {CATS.slice(0,8).map(c=>(
            <div key={c.name} onClick={()=>nav("products")}
              style={{background:GR,border:`1px solid ${BDR}`,padding:"14px 8px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=R;e.currentTarget.style.background="#fff"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=BDR;e.currentTarget.style.background=GR}}>
              <div style={{width:38,height:38,background:c.bg,borderRadius:"50%",margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.85)",fontSize:10,fontWeight:900,letterSpacing:.5}}>{c.abbr}</div>
              <div style={{fontSize:11,fontWeight:700,color:BK,lineHeight:1.3}}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div style={{padding:"32px 20px",background:GR}}>
        <div style={{maxWidth:1300,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <h2 style={{fontWeight:900,fontSize:26,letterSpacing:.8,textTransform:"uppercase"}}>Best Sellers</h2>
            <span onClick={()=>nav("products")} style={{color:R,cursor:"pointer",fontSize:13,fontWeight:700,letterSpacing:.5}}>View All →</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
            {PRODS.slice(0,4).map(p=><ProductCard key={p.id} p={p} onAdd={()=>setCartCount(c=>c+1)}/>)}
          </div>
        </div>
      </div>

      {/* Pro Banner */}
      <div onClick={()=>setProModal(true)} style={{background:BK,padding:"40px 28px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap"}}>
        <div>
          <div style={{color:"#666",fontSize:11,fontWeight:700,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>Exclusive Membership</div>
          <div style={{color:"#fff",fontWeight:900,fontSize:30,lineHeight:1.1}}>NutriFit <span style={{color:R}}>PRO ACCESS</span></div>
          <div style={{color:"#666",fontSize:13,marginTop:8}}>BOGO deals · Cash back rewards · Free shipping & more</div>
        </div>
        <div style={{minWidth:280}}>
          <div style={{background:R,color:"#fff",padding:"5px 14px",fontSize:10,fontWeight:700,letterSpacing:1,display:"inline-block",marginBottom:12}}>IT PAYS TO GO PRO</div>
          <ul style={{color:"#bbb",fontSize:12.5,listStyle:"none",padding:0,lineHeight:2.1,margin:"0 0 16px"}}>
            {["BOGO 50% Off 1st–7th every month","15% Cash Back with Pick-A-Day offers","10% Cash Back on every purchase","FREE shipping on every order"].map(t=><li key={t}>✓ {t}</li>)}
          </ul>
          <button style={{background:"#fff",color:BK,border:"none",padding:"13px 28px",fontSize:13,fontWeight:700,letterSpacing:.8,cursor:"pointer"}}>
            ADD PRO ACCESS — CHF 39.99
          </button>
        </div>
      </div>

      {/* New arrivals */}
      <div style={{padding:"32px 20px"}}>
        <div style={{maxWidth:1300,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <h2 style={{fontWeight:900,fontSize:26,letterSpacing:.8,textTransform:"uppercase"}}>New on the Drop</h2>
            <span onClick={()=>nav("products")} style={{color:R,cursor:"pointer",fontSize:13,fontWeight:700}}>View All →</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
            {PRODS.slice(4,8).map(p=><ProductCard key={p.id} p={p} onAdd={()=>setCartCount(c=>c+1)}/>)}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div style={{background:"#fff",borderTop:`1px solid ${BDR}`,borderBottom:`1px solid ${BDR}`,padding:"20px 20px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,textAlign:"center"}}>
        {[["🚚","Free Shipping","Orders over CHF 79"],["↩","30-Day Returns","No questions asked"],["🛡","Swiss Quality","Lab tested & certified"],["💬","Expert Support","Mon–Sat, 9am–6pm"]].map(([ic,t,s])=>(
          <div key={t}><div style={{fontSize:22,marginBottom:6}}>{ic}</div><div style={{fontWeight:700,fontSize:13}}>{t}</div><div style={{color:"#888",fontSize:11,marginTop:2}}>{s}</div></div>
        ))}
      </div>
    </div>
  )
}

function ShopPage({nav}){
  return(
    <div style={{maxWidth:1300,margin:"0 auto",padding:"24px 20px 48px"}}>
      <div style={{fontSize:12,color:"#888",marginBottom:16}}>Shop › All Categories</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <h1 style={{fontWeight:900,fontSize:30,letterSpacing:.8,textTransform:"uppercase"}}>All Categories</h1>
        <div style={{fontSize:13,color:"#888"}}>{CATS.length} departments</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:16}}>
        {CATS.map(c=>(
          <div key={c.name} onClick={()=>nav("products")}
            style={{background:"#fff",border:`1px solid ${BDR}`,cursor:"pointer",transition:"all .2s",overflow:"hidden"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=R}
            onMouseLeave={e=>e.currentTarget.style.borderColor=BDR}>
            <div style={{background:c.bg,height:110,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
              <div style={{color:"rgba(255,255,255,0.08)",fontSize:90,fontWeight:900,position:"absolute",lineHeight:1}}>{c.abbr}</div>
              <span style={{color:"rgba(255,255,255,0.92)",fontSize:26,fontWeight:900,letterSpacing:2,position:"relative",zIndex:1}}>{c.abbr}</span>
            </div>
            <div style={{padding:"14px 16px"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{c.name}</div>
              <div style={{fontSize:12,color:"#888"}}>{c.count} products →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SidebarFilter({title,options}){
  const[open,setOpen]=useState(false)
  const[checked,setChecked]=useState([])
  const toggle=v=>setChecked(c=>c.includes(v)?c.filter(x=>x!==v):[...c,v])
  return(
    <div style={{borderBottom:`1px solid ${BDR}`}}>
      <div onClick={()=>setOpen(!open)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",cursor:"pointer",fontWeight:700,fontSize:12.5,letterSpacing:.6,textTransform:"uppercase"}}>
        {title}<span style={{fontSize:18,color:"#888",fontWeight:400}}>{open?"−":"+"}</span>
      </div>
      {open&&<div style={{paddingBottom:12}}>
        {options.map(opt=>(
          <label key={opt} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",cursor:"pointer",fontSize:13,color:"#444"}}>
            <input type="checkbox" checked={checked.includes(opt)} onChange={()=>toggle(opt)} style={{accentColor:R,width:14,height:14}}/>{opt}
          </label>
        ))}
      </div>}
    </div>
  )
}

function ProductsPage({nav,setCartCount}){
  const[sort,setSort]=useState("Top Sellers")
  const[storeToggle,setStoreToggle]=useState(false)
  return(
    <div style={{maxWidth:1400,margin:"0 auto",padding:"0 16px"}}>
      <div style={{padding:"14px 0",fontSize:12.5,color:"#888"}}>
        <span onClick={()=>nav("home")} style={{cursor:"pointer",textDecoration:"underline"}}>Shop</span> › Products
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${BDR}`,marginBottom:4,cursor:"pointer"}} onClick={()=>setStoreToggle(!storeToggle)}>
        <div style={{width:40,height:22,background:storeToggle?R:"#ccc",borderRadius:11,position:"relative",transition:"background .2s"}}>
          <div style={{position:"absolute",left:storeToggle?20:2,top:2,width:18,height:18,background:"#fff",borderRadius:"50%",boxShadow:"0 1px 3px rgba(0,0,0,0.3)",transition:"left .2s"}}/>
        </div>
        <span style={{fontSize:13}}>FREE In-Store Pick Up at </span>
        <span style={{color:R,fontWeight:700,textDecoration:"underline",fontSize:13}}>Find Your Store</span>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:28,alignItems:"start"}}>
        {/* Sidebar */}
        <div style={{paddingTop:16}}>
          <div style={{fontWeight:900,fontSize:13,letterSpacing:.8,marginBottom:12}}>DEPARTMENTS</div>
          {FILTER_DATA.departments.map((d,i)=>(
            <div key={d} style={{padding:"6px 0 6px 12px",fontSize:13,cursor:"pointer",color:i===0?BK:"#888",fontWeight:i===0?600:400}}
              onMouseEnter={e=>e.currentTarget.style.color=R}
              onMouseLeave={e=>e.currentTarget.style.color=i===0?BK:"#888"}>
              {i===0&&<span style={{color:R}}>▼ </span>}{d}
            </div>
          ))}
          <div style={{marginTop:8}}>
            <SidebarFilter title="Brand" options={FILTER_DATA.brand}/>
            <SidebarFilter title="Product Type" options={FILTER_DATA.productType}/>
            <SidebarFilter title="Price" options={FILTER_DATA.price}/>
            <SidebarFilter title="By Goal" options={FILTER_DATA.byGoal}/>
            <SidebarFilter title="Customer Ratings" options={FILTER_DATA.ratings}/>
            <SidebarFilter title="Collection" options={["GNC Pro Performance","Beyond Raw","GNC Total Lean"]}/>
            <SidebarFilter title="Flavor" options={FILTER_DATA.flavor}/>
            <SidebarFilter title="Product Form" options={FILTER_DATA.form}/>
            <SidebarFilter title="Specialty Diet" options={FILTER_DATA.diet}/>
            <SidebarFilter title="More Ways to Shop" options={["New Arrivals","On Sale","Top Rated","Bundle & Save"]}/>
            <SidebarFilter title="Banned Substance Certification" options={["NSF Certified","Informed Sport","BSCG Certified"]}/>
          </div>
        </div>

        {/* Products */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",flexWrap:"wrap",gap:12}}>
            <h1 style={{fontWeight:900,fontSize:26,letterSpacing:.8}}>
              PRODUCTS <span style={{fontSize:15,fontWeight:400,color:"#888"}}>(147 Results)</span>
            </h1>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:13,color:"#888"}}>Sort By:</span>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{border:`1px solid ${BDR}`,padding:"8px 12px",fontSize:13,cursor:"pointer",background:"#fff"}}>
                <option>Top Sellers</option><option>Newest</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Customer Rating</option>
              </select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:32}}>
            {PRODS.map(p=><ProductCard key={p.id} p={p} onAdd={()=>setCartCount(c=>c+1)}/>)}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:6,paddingBottom:40}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} style={{width:36,height:36,border:`1.5px solid ${n===1?BK:BDR}`,background:n===1?BK:"#fff",color:n===1?"#fff":"#444",fontSize:13,fontWeight:600,cursor:"pointer"}}>{n}</button>
            ))}
            <button style={{padding:"0 14px",height:36,border:`1.5px solid ${BDR}`,background:"#fff",fontSize:13,cursor:"pointer"}}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogPage(){
  const[active,setActive]=useState("All")
  const cats=["All","Pre-workout","Protein","Sports & Fitness","Expert Education","Women's Health"]
  const shown=active==="All"?BLOGS:BLOGS.filter(b=>b.cat===active)
  return(
    <div>
      <div style={{background:"#0a0a0a",minHeight:210,display:"flex",alignItems:"flex-end",padding:"40px 28px",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 100%)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <h1 style={{fontWeight:900,fontSize:38,color:"#fff",marginBottom:10}}>Sports & Fitness</h1>
          <p style={{color:"#bbb",fontSize:13.5,maxWidth:700,lineHeight:1.65}}>
            Read NutriFitness's sport and fitness articles from health and nutrition experts. Find workouts and tips designed for your fitness and health in mind.
          </p>
        </div>
      </div>

      <div style={{background:GR,display:"flex",gap:0,overflowX:"auto",borderBottom:`1px solid ${BDR}`,padding:"0 20px"}}>
        {cats.map(c=>(
          <div key={c} onClick={()=>setActive(c)}
            style={{padding:"14px 20px",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0,borderBottom:`3px solid ${active===c?R:"transparent"}`,color:active===c?R:"#555",transition:"all .2s",marginBottom:-1}}>
            {c}
          </div>
        ))}
      </div>

      <div style={{padding:"32px 20px",maxWidth:1400,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {shown.map(b=>(
            <div key={b.id}
              style={{background:"#fff",border:`1px solid ${BDR}`,cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.1)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <div style={{height:190,background:b.bg,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{color:"rgba(255,255,255,0.08)",fontSize:90,fontWeight:900,position:"absolute",lineHeight:1,userSelect:"none"}}>{b.cat.charAt(0)}</div>
                <div style={{position:"relative",zIndex:1,textAlign:"center",padding:16}}>
                  <div style={{background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:9,fontWeight:700,letterSpacing:1.2,padding:"4px 10px",display:"inline-block",textTransform:"uppercase"}}>
                    {b.cat}
                  </div>
                </div>
              </div>
              <div style={{padding:"16px 16px 18px"}}>
                <h3 style={{fontWeight:700,fontSize:14,lineHeight:1.4,marginBottom:8,minHeight:40}}>{b.title}</h3>
                <p style={{fontSize:12,color:"#666",lineHeight:1.65,marginBottom:12}}>{b.excerpt}</p>
                <div style={{fontSize:11,color:"#aaa"}}>{b.date} <span style={{margin:"0 4px"}}>|</span> {b.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProPage(){
  return(
    <div style={{maxWidth:820,margin:"0 auto",padding:"40px 20px 60px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{background:BK,padding:"48px 32px",marginBottom:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",marginBottom:20}}>
            <div style={{background:R,color:"#fff",padding:"8px 16px",fontWeight:900,fontSize:22,letterSpacing:2}}>NF</div>
            <div style={{color:"#fff",fontWeight:900,fontSize:28,letterSpacing:1}}>PRO ACCESS</div>
          </div>
          <div style={{color:"#666",fontSize:13,marginBottom:24,letterSpacing:.5,textTransform:"uppercase"}}>IT PAYS TO GO PRO.</div>
          <button style={{background:"#fff",color:BK,border:"none",padding:"16px 48px",fontSize:14,fontWeight:700,letterSpacing:.8,cursor:"pointer"}}>
            ADD PRO ACCESS FOR CHF 39.99
          </button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:28}}>
        {[
          {icon:"🏆",title:"BOGO 50% Off Almost EVERYTHING",sub:"the 1st–7th of every month"},
          {icon:"💰",title:"15% Cash Back Rewards",sub:"with Pick-A-Day offers to end each month"},
          {icon:"🔄",title:"10% Cash Back Rewards",sub:"on every purchase you make"},
          {icon:"🚚",title:"FREE Shipping Always",sub:"save on every single order automatically"},
        ].map(b=>(
          <div key={b.title} style={{background:GR,padding:20,border:`1px solid ${BDR}`}}>
            <div style={{fontSize:26,marginBottom:8}}>{b.icon}</div>
            <div style={{fontWeight:700,fontSize:13.5,color:R,marginBottom:4}}>{b.title}</div>
            <div style={{fontSize:13,color:"#666"}}>{b.sub}</div>
          </div>
        ))}
      </div>

      <div style={{background:GR,padding:28,border:`1px solid ${BDR}`,marginBottom:24}}>
        <h3 style={{fontWeight:900,fontSize:19,marginBottom:20,letterSpacing:.5}}>DON'T MISS OUT ON THESE PRO EXCLUSIVE EVENTS!</h3>
        {[
          ["BOGO 50% Off Almost EVERYTHING","the 1st – 7th of every month"],
          ["15% Cash Back Rewards","with Pick-A-Day Offers to end each month"],
          ["10% Cash Back Rewards","on every purchase"],
        ].map(([h,r])=>(
          <p key={h} style={{fontSize:14,marginBottom:14,lineHeight:1.6}}>
            <span style={{color:R,fontWeight:700}}>{h}</span> {r}
          </p>
        ))}
      </div>

      <div style={{background:BK,padding:28}}>
        <p style={{color:"#888",fontSize:13.5,marginBottom:16}}>Already a Member? <span style={{color:R,cursor:"pointer",fontWeight:700}}>Sign In</span></p>
        <button style={{background:R,color:"#fff",border:"none",padding:"16px",fontSize:14,fontWeight:700,letterSpacing:.8,cursor:"pointer",width:"100%"}}>
          ADD PRO ACCESS FOR CHF 39.99
        </button>
      </div>
    </div>
  )
}

function AccountPage({nav}){
  const[mode,setMode]=useState("login")
  const[form,setForm]=useState({email:"",pass:"",name:""})
  const f=k=>e=>setForm(x=>({...x,[k]:e.target.value}))
  return(
    <div style={{minHeight:500,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px",background:GR}}>
      <div style={{background:"#fff",border:`1px solid ${BDR}`,padding:"36px 36px 32px",width:"100%",maxWidth:440,boxShadow:"0 2px 24px rgba(0,0,0,0.07)"}}>
        <h1 style={{fontWeight:900,fontSize:26,letterSpacing:.8,textAlign:"center",marginBottom:24}}>
          {mode==="login"?"SIGN IN":"CREATE ACCOUNT"}
        </h1>
        <div style={{display:"flex",border:`1px solid ${BDR}`,marginBottom:24}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{flex:1,padding:"10px",border:"none",background:mode===m?BK:"#fff",color:mode===m?"#fff":"#777",fontSize:12,fontWeight:700,letterSpacing:.8,cursor:"pointer",textTransform:"uppercase"}}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="register"&&<input placeholder="Full Name" value={form.name} onChange={f("name")} style={{border:`1px solid #ddd`,padding:"12px 14px",fontSize:13}}/>}
          <input type="email" placeholder="Email Address" value={form.email} onChange={f("email")} style={{border:`1px solid #ddd`,padding:"12px 14px",fontSize:13}}/>
          <input type="password" placeholder="Password" value={form.pass} onChange={f("pass")} style={{border:`1px solid #ddd`,padding:"12px 14px",fontSize:13}}/>
        </div>
        {mode==="login"&&<div style={{textAlign:"right",marginTop:8}}><span style={{fontSize:12,color:R,cursor:"pointer"}}>Forgot Password?</span></div>}
        <button style={{width:"100%",background:BK,color:"#fff",border:"none",padding:"14px",fontSize:13,fontWeight:700,letterSpacing:.8,cursor:"pointer",marginTop:18}}>
          {mode==="login"?"SIGN IN":"CREATE ACCOUNT"}
        </button>
        <div style={{marginTop:16,padding:16,background:GR,border:`1px solid ${BDR}`,textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:.8,marginBottom:6}}>JOIN PRO ACCESS</div>
          <div style={{fontSize:12,color:"#777",marginBottom:10}}>BOGO deals · 10% cash back · Free shipping</div>
          <button onClick={()=>nav("pro")} style={{background:R,color:"#fff",border:"none",padding:"9px 22px",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:.5}}>LEARN MORE</button>
        </div>
        <p style={{textAlign:"center",fontSize:12,color:"#888",marginTop:14}}>
          {mode==="login"?"Don't have an account? ":"Already registered? "}
          <span style={{color:R,fontWeight:700,cursor:"pointer"}} onClick={()=>setMode(m=>m==="login"?"register":"login")}>
            {mode==="login"?"Register free":"Sign in"}
          </span>
        </p>
      </div>
    </div>
  )
}

function Footer({nav}){
  const cols=[
    {title:"Get Help",links:["Track Order","Contact Us","Help Center & FAQs","Learning Center","Delivery & Pick Up Options","Shipping","Return Policy","Give Us Your Feedback"]},
    {title:"Shop With Us",links:["Find a Store","Shop with a Coach","Subscribe to Save","Gift Cards","Pick Up In-Store","Price Match Guarantee","International Websites","Discount Programs","Product Collections"]},
    {title:"About NutriFit",links:["About Us","News","Articles","Accessibility Statement","Franchise Opportunities","Rewards Program","PRO Access","Live Well Foundation","Affiliate Program","New Vendors","Science & Innovation","Supply Chain Act","Careers"]},
  ]
  return(
    <footer style={{background:"#fff",borderTop:`2px solid ${BDR}`}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:28,padding:"44px 28px",maxWidth:1400,margin:"0 auto"}}>
        {cols.map(c=>(
          <div key={c.title}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:14,letterSpacing:.4}}>{c.title}</div>
            {c.links.map(l=>(
              <div key={l} style={{fontSize:13,color:"#555",padding:"4px 0",cursor:"pointer",lineHeight:1.7,transition:"color .15s"}}
                onMouseEnter={e=>e.currentTarget.style.color=R}
                onMouseLeave={e=>e.currentTarget.style.color="#555"}>{l}</div>
            ))}
          </div>
        ))}
        <div>
          <div style={{fontWeight:900,fontSize:17,marginBottom:4,letterSpacing:.3}}>STAY CONNECTED</div>
          <div style={{fontSize:13,color:"#888",marginBottom:14}}>Get the latest deals and more when you sign up</div>
          <div style={{fontSize:12,fontWeight:700,marginBottom:7}}>Sign Up for NutriFit Email</div>
          <div style={{display:"flex",marginBottom:24}}>
            <input placeholder="Enter email" style={{flex:1,border:`1px solid #ccc`,padding:"10px 12px",fontSize:13}}/>
            <button style={{background:BK,color:"#fff",border:"none",padding:"10px 16px",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:.8}}>SIGN UP</button>
          </div>
          <div style={{fontWeight:900,fontSize:15,marginBottom:4}}>DOWNLOAD THE APP</div>
          <div style={{fontSize:12,color:"#888",marginBottom:10}}>Get a CHF 5 reward when you download the app!</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {["▶  Get it on Google Play","🍎  Download on the App Store"].map(s=>(
              <button key={s} style={{background:BK,color:"#fff",border:"none",padding:"10px 14px",fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"left",letterSpacing:.3}}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${BDR}`,padding:"22px 28px"}}>
        <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
          {[["f","Facebook"],["X","X / Twitter"],["▶","YouTube"],["in","Instagram"],["♫","TikTok"]].map(([ic,lbl])=>(
            <button key={lbl} title={lbl}
              style={{width:36,height:36,borderRadius:"50%",background:BK,color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",transition:"background .2s"}}
              onMouseEnter={e=>e.currentTarget.style.background=R}
              onMouseLeave={e=>e.currentTarget.style.background=BK}>{ic}</button>
          ))}
        </div>
        <p style={{fontSize:12,color:"#999",marginBottom:6}}>If you are using a screen reader and are having problems using this website, please call 0800-NUTRIFIT or email support@nutrifitness.ch for assistance.</p>
        <p style={{fontSize:12,color:"#aaa"}}>
          © 1997–2026 NutriFitness Holdings, LLC &nbsp;|&nbsp;
          <span style={{cursor:"pointer",textDecoration:"underline"}}>Privacy Statement</span> &nbsp;|&nbsp;
          <span style={{cursor:"pointer",textDecoration:"underline"}}>Your Privacy Choices</span> &nbsp;|&nbsp;
          <span style={{cursor:"pointer",textDecoration:"underline"}}>Terms & Conditions</span> &nbsp;|&nbsp;
          <span style={{cursor:"pointer",textDecoration:"underline"}}>Accessibility Statement</span>
        </p>
      </div>
    </footer>
  )
}

function ChatWidget({open,setOpen,min,setMin}){
  const[form,setForm]=useState({first:"",last:"",email:"",phone:"",help:""})
  const f=k=>e=>setForm(x=>({...x,[k]:e.target.value}))
  const inp={width:"100%",border:`1px solid #ccc`,padding:"10px 12px",fontSize:13,fontFamily:"inherit"}
  const lbl={fontSize:12,fontWeight:700,display:"block",marginBottom:5}
  return(
    <div style={{textAlign:"right",padding:"0 20px 0",background:"transparent"}}>
      {!open?(
        <button onClick={()=>setOpen(true)}
          style={{background:R,color:"#fff",border:"none",padding:"12px 20px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:.4}}>
          💬 Chat with Us
        </button>
      ):(
        <div style={{display:"inline-block",width:340,textAlign:"left",border:`1px solid ${BDR}`,background:"#fff",boxShadow:"0 -4px 24px rgba(0,0,0,0.14)"}}>
          <div style={{background:R,color:"#fff",padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{background:"rgba(255,255,255,0.2)",padding:"2px 7px",fontSize:10,fontWeight:700,letterSpacing:1}}>NF</div>
              <span style={{fontWeight:700,fontSize:14}}>Chat</span>
            </div>
            <div style={{display:"flex",gap:14}}>
              <button onClick={()=>setMin(!min)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:18,fontWeight:700,lineHeight:1}}>∨</button>
              <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:18,fontWeight:700,lineHeight:1}}>×</button>
            </div>
          </div>
          {!min&&(
            <div style={{padding:16}}>
              {[["first","First Name","text"],["last","Last Name","text"],["email","Email","email"],["phone","Phone","tel"]].map(([k,lbTxt,tp])=>(
                <div key={k} style={{marginBottom:12}}>
                  <label style={lbl}><span style={{color:R}}>*</span> {lbTxt}</label>
                  <input type={tp} value={form[k]} onChange={f(k)} style={inp}/>
                </div>
              ))}
              <div style={{marginBottom:16}}>
                <label style={lbl}><span style={{color:R}}>*</span> How can we help you?</label>
                <select value={form.help} onChange={f("help")} style={inp}>
                  <option value="">None</option>
                  <option>Order Inquiry</option>
                  <option>Product Question</option>
                  <option>Returns & Refunds</option>
                  <option>Account Help</option>
                  <option>Other</option>
                </select>
              </div>
              <button style={{width:"100%",background:BK,color:"#fff",border:"none",padding:"14px",fontSize:13,fontWeight:700,letterSpacing:.8,cursor:"pointer"}}>
                Start Conversation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ProModal({onClose,nav}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:9999,display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}}>
      <div style={{width:460,background:"#fff",height:"100vh",overflowY:"auto",padding:32,boxShadow:"-4px 0 24px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <h2 style={{fontWeight:900,fontSize:24,letterSpacing:.5}}>SIGN UP FOR PRO</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"#888"}}>×</button>
        </div>
        <button style={{width:"100%",background:BK,color:"#fff",border:"none",padding:"16px",fontSize:14,fontWeight:700,letterSpacing:.8,cursor:"pointer",marginBottom:20}}>
          ADD PRO ACCESS FOR CHF 39.99
        </button>
        <div style={{background:BK,padding:24,marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{background:R,color:"#fff",padding:"6px 12px",fontWeight:900,fontSize:16,letterSpacing:1}}>NF</div>
            <div style={{color:"#fff",fontWeight:900,fontSize:18,letterSpacing:.5}}>PRO ACCESS</div>
          </div>
          <div style={{color:"#888",fontSize:12,fontWeight:700,letterSpacing:.5,marginBottom:10}}>IT PAYS TO GO PRO.</div>
          {["BOGO 50% Off Almost EVERYTHING the 1st – 7th of every month","15% Cash Back Rewards with Pick-A-Day offers to end each month","10% Cash Back Rewards on every purchase","Save on every order with FREE Shipping"].map(t=>(
            <div key={t} style={{display:"flex",gap:8,marginBottom:8,fontSize:13,color:"#ccc",alignItems:"flex-start"}}>
              <span>•</span><span>{t}</span>
            </div>
          ))}
          <span onClick={()=>{onClose();nav("pro")}} style={{color:R,cursor:"pointer",fontWeight:700,fontSize:13,textDecoration:"underline",display:"block",marginTop:12}}>LEARN MORE</span>
        </div>
        <p style={{fontSize:14,marginBottom:16}}>Don't miss out on these <span style={{color:R,fontWeight:700}}>PRO EXCLUSIVE</span> events!</p>
        {[
          ["BOGO 50% Off Almost EVERYTHING","the 1st – 7th of every month"],
          ["15% Cash Back Rewards","with Pick-A-Day Offers to end each month"],
          ["10% Cash Back Rewards","on every purchase"],
        ].map(([h,r])=>(
          <p key={h} style={{fontSize:14,marginBottom:14,lineHeight:1.6}}>
            <span style={{color:R,fontWeight:700}}>{h}</span> {r}
          </p>
        ))}
        <div style={{borderTop:`1px solid ${BDR}`,paddingTop:20,marginTop:8}}>
          <p style={{fontSize:13,color:"#888",marginBottom:14}}>Already a Member? <span style={{color:R,cursor:"pointer",fontWeight:700}}>Sign In</span></p>
          <button style={{width:"100%",background:BK,color:"#fff",border:"none",padding:"16px",fontSize:13,fontWeight:700,letterSpacing:.8,cursor:"pointer"}}>
            ADD PRO ACCESS FOR CHF 39.99
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App(){
  const[page,setPage]=useState("home")
  const[chat,setChat]=useState(false)
  const[chatMin,setChatMin]=useState(false)
  const[cartCount,setCartCount]=useState(1)
  const[proModal,setProModal]=useState(false)
  const[mobileMenu,setMobileMenu]=useState(false)

  const nav=p=>{setPage(p);setMobileMenu(false)}

  const PAGES_LABEL={home:"Home",shop:"Shop",products:"Products",blog:"Blog",pro:"Pro Access",account:"Account",cart:"Cart"}

  return(
    <div style={{fontFamily:"system-ui,Arial,sans-serif",background:"#fff",color:BK,minHeight:"100vh"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @media(max-width:900px){
          .sidebar{display:none!important}
          .products-layout{grid-template-columns:1fr!important}
          .footer-cols{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:680px){
          .prod-grid-3{grid-template-columns:1fr 1fr!important}
          .blog-grid-4{grid-template-columns:1fr 1fr!important}
          .cat-grid-auto{grid-template-columns:repeat(2,1fr)!important}
          .footer-cols{grid-template-columns:1fr!important}
          .hero-h1{font-size:34px!important}
          .nav-search-wrap{display:none!important}
          .desktop-nav-right{display:none!important}
        }
        @media(max-width:480px){
          .blog-grid-4{grid-template-columns:1fr!important}
          .prod-grid-3{grid-template-columns:1fr!important}
        }
        input,select{font-family:inherit}
        input:focus,select:focus{outline:2px solid ${R};outline-offset:0}
      `}</style>

      {/* Top utility bar */}
      <div style={{background:GR,padding:"6px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12,borderBottom:`1px solid ${BDR}`,flexWrap:"wrap",gap:4}}>
        <div style={{display:"flex",gap:14,color:"#555"}}>
          <span style={{cursor:"pointer",textDecoration:"underline"}}>Enable Accessibility</span>
          <span>|</span>
          <span style={{cursor:"pointer",textDecoration:"underline"}}>Find a Store</span>
        </div>
        <span style={{cursor:"pointer",color:R,fontWeight:700,fontSize:12}}>Buy 1, Get 1 50% Off! SHOP NOW</span>
        <button onClick={()=>setProModal(true)} style={{background:BK,color:"#fff",border:"none",padding:"4px 12px",fontSize:11,cursor:"pointer",fontWeight:700,letterSpacing:.3}}>
          ★ Make Me a PRO Access Member
        </button>
      </div>

      {/* Main nav */}
      <nav style={{background:"#fff",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,zIndex:200,flexWrap:"wrap"}}>
        <div onClick={()=>nav("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{background:R,color:"#fff",padding:"4px 9px",fontWeight:900,fontSize:18,letterSpacing:1,lineHeight:1}}>NF</div>
          <div>
            <div style={{fontWeight:900,fontSize:15,lineHeight:1,color:BK}}>NUTRI<span style={{color:R}}>FITNESS</span></div>
            <div style={{fontSize:8,letterSpacing:2,color:"#aaa",lineHeight:1,marginTop:1}}>SINCE 2018</div>
          </div>
        </div>

        <div className="nav-search-wrap" style={{flex:1,maxWidth:580,display:"flex",minWidth:160}}>
          <input style={{flex:1,border:"1.5px solid #ccc",borderRight:"none",padding:"9px 14px",fontSize:13}} placeholder="What can we help you find today?"/>
          <button style={{background:BK,color:"#fff",border:"none",padding:"9px 16px",cursor:"pointer",fontSize:15}}>🔍</button>
        </div>

        <div className="desktop-nav-right" style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:18,flexShrink:0}}>
          <div onClick={()=>nav("account")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:600}}>
            <span style={{fontSize:18}}>👤</span><span>Account</span>
          </div>
          <div onClick={()=>nav("cart")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:600,position:"relative"}}>
            <span style={{fontSize:18}}>🛒</span>
            {cartCount>0&&<span style={{position:"absolute",top:-5,right:-7,background:R,color:"#fff",borderRadius:"50%",width:15,height:15,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{cartCount}</span>}
            <span>Cart</span>
          </div>
        </div>

        <button onClick={()=>setMobileMenu(!mobileMenu)} style={{marginLeft:"auto",background:"none",border:`1px solid ${BDR}`,padding:"7px 10px",cursor:"pointer",display:"none",fontSize:16}} className="mobile-menu-btn">
          ☰
        </button>
      </nav>

      {/* Secondary nav */}
      <div style={{background:"#fff",borderBottom:`2px solid ${BDR}`,display:"flex",alignItems:"center",overflowX:"auto",position:"sticky",top:57,zIndex:199}}>
        <div style={{padding:"0 12px",display:"flex",alignItems:"center"}}>
          {[
            {label:"⊞ SHOP",p:"shop"},
            {label:"📰 BLOG",p:"blog"},
          ].map(item=>(
            <div key={item.p} onClick={()=>nav(item.p)}
              style={{padding:"11px 14px",cursor:"pointer",fontWeight:700,fontSize:12.5,letterSpacing:.5,borderBottom:`2px solid ${page===item.p?R:"transparent"}`,marginBottom:-2,color:page===item.p?R:BK,flexShrink:0,transition:"all .15s"}}>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{flex:1}}/>
        {[
          {label:"💰 DEALS",red:true},{label:"BEST SELLERS"},{label:"NEW ON THE DROP"},{label:"CREATINE"},{label:"LAST CHANCE",red:true},
        ].map(item=>(
          <div key={item.label} onClick={()=>nav("products")}
            style={{padding:"11px 14px",cursor:"pointer",fontWeight:700,fontSize:12,letterSpacing:.4,color:item.red?R:BK,borderBottom:"2px solid transparent",marginBottom:-2,flexShrink:0,whiteSpace:"nowrap"}}>
            {item.label}
          </div>
        ))}
      </div>

      {/* Promo bar */}
      <div style={{background:BK,color:"#fff",display:"flex",borderBottom:"1px solid #222"}}>
        {["Buy 1, Get 1 50% Off!!","Free Shipping Over CHF 79","Save 10% When You Pick Up In-Store!"].map((msg,i)=>(
          <div key={i} style={{flex:1,textAlign:"center",padding:"8px 4px",fontSize:12,fontWeight:600,borderRight:i<2?"1px solid #333":"none",cursor:"pointer"}}>
            {msg}
          </div>
        ))}
      </div>

      {/* Page content */}
      {page==="home"&&<HomePage nav={nav} setCartCount={setCartCount} setProModal={setProModal}/>}
      {page==="shop"&&<ShopPage nav={nav}/>}
      {page==="products"&&<ProductsPage nav={nav} setCartCount={setCartCount}/>}
      {page==="blog"&&<BlogPage/>}
      {page==="pro"&&<ProPage/>}
      {page==="account"&&<AccountPage nav={nav}/>}
      {page==="cart"&&(
        <div style={{maxWidth:700,margin:"0 auto",padding:"48px 20px",textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:20}}>🛒</div>
          <h2 style={{fontWeight:900,fontSize:24,marginBottom:8}}>YOUR CART IS EMPTY</h2>
          <p style={{color:"#888",marginBottom:24}}>Add some products to get started!</p>
          <button onClick={()=>nav("products")} style={{background:R,color:"#fff",border:"none",padding:"14px 36px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:.8}}>SHOP NOW</button>
        </div>
      )}

      {/* Footer */}
      <Footer nav={nav}/>

      {/* Chat widget — sticky bottom right */}
      <div style={{position:"sticky",bottom:0,zIndex:400,pointerEvents:"none",display:"flex",justifyContent:"flex-end",alignItems:"flex-end"}}>
        <div style={{pointerEvents:"auto"}}>
          <ChatWidget open={chat} setOpen={setChat} min={chatMin} setMin={setChatMin}/>
        </div>
      </div>

      {/* Pro modal — position fixed (slides from right) */}
      {proModal&&<ProModal onClose={()=>setProModal(false)} nav={nav}/>}
    </div>
  )
}
