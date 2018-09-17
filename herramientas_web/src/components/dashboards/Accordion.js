import React from 'react';

export default class Accordion extends React.Component {  
  render() {
    var conf = this.props.conf;
    return (
      <div>
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-6">
            <h4 id="accordionTitle" className="float-left ml-1 font-weight-bold">{conf.title.text}</h4>
          </div>          
          <div className="col-xl-6 col-lg-6 col-6">
            <h4 id="count" className="float-right mr-1 font-weight-bold">{conf.title.value}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-12">
            <div id="accordionCrypto" role="tablist" aria-multiselectable="true">
              <div className="card collapse-icon accordion-icon-rotate">
                {conf.tabs.map((tab, indexTab)=>{
                  return(
                    <div key={indexTab}>                      
                      <div id={"heading"+indexTab} className={"card-header bg-"+ conf.primaryClassColor +" p-1 bg-lighten-1" + (indexTab > 0 ? " mt-1" : "")}>
                        <a data-toggle="collapse" data-parent="#accordionCrypto" href={"#accordion"+indexTab} aria-expanded={tab.opened ? "true" : "false"} aria-controls={"accordion"+indexTab} className={"card-title lead white "+(tab.opened ? "" : "collapsed")}>{tab.headerText}</a>
                      </div>
                      <div id={"accordion"+indexTab} role="tabpanel" aria-labelledby={"heading"+indexTab} className={"card-collapse collapse "+(tab.opened ? "show" : "")} aria-expanded="true">
                        <div className="card-content">
                          <div className="card-body p-0">
                            <div className="media-list list-group">
                              {tab.cards.map((card, indexCard)=>{
                                return(
                                  <div key={indexCard} className={"list-group-item list-group-item-action media p-1" + (indexCard % 2 !== 0 ? " bg-"+ conf.secondaryClassColor +" bg-lighten-5": "")}>
                                    <a className="media-link">
                                      <span className="media-left">
                                        <p className={"text-bold-600 m-0 "+card.headerRowClassLabel}>{card.headerRowLabel}</p>
                                        <p className="font-small-2 text-muted m-0">{card.row1Label}</p>
                                        <p className="font-small-2 text-muted m-0">{card.row2Label}</p>
                                      </span>
                                      <span className="media-body text-right">
                                        <p className="text-bold-600 m-0">{card.headerRowValue === "" ? "." : card.headerRowValue }</p>
                                        <p className="font-small-2 text-muted m-0 text-bold-600">{card.row1Value}</p>
                                        <p className="font-small-2 text-muted m-0 text-bold-600">{card.row2Value}</p>
                                      </span>
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
