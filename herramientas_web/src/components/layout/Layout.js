import React, { Component } from 'react'
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom'
import Config from '../../commons/config/Config.js';
import Security from '../../commons/security/Security.js'
import '../../assets/css/styles.css'
import DashboardOperativo from '../../components/dashboards/DashboardOperativo.js'
import Error from '../../components/errors/Error.js'
import ChangePassword from '../../components/auth/ChangePassword.js'
import Perfiles from '../../components/perfiles/Perfiles.js'
import Personas from '../../components/personas/Personas.js'
import Moviles from '../../components/moviles/Moviles.js'
import Avl from '../../components/avl/Avl.js'
import Osticket from '../../components/osticket/Osticket.js'
import Bases from '../../components/bases/Bases.js'
import Gerenciadores from '../../components/gerenciadores/Gerenciadores.js'
import Correctivos from '../../components/correctivos/Correctivos.js'
import Tickets from '../../components/tickets/Tickets.js'
import Regiones from '../../components/regiones/Regiones.js'
import SubRegiones from '../../components/subregiones/Subregiones.js'
import Talleres from '../../components/talleres/Talleres.js'
import Marcas from '../../components/marcas/Marcas.js'
import Modelos from '../../components/modelos/Modelos.js'
import ModeloTipos from '../../components/modelotipos/ModeloTipos.js'
import CentrosCostos from '../../components/centroscostos/CentrosCostos.js'
import CentrosBeneficios from '../../components/centrosbeneficios/CentrosBeneficios.js'
import Vencimientos from '../../components/vencimientos/Vencimientos.js'
import Servicios from '../../components/servicios/Servicios.js'
import Tareas from '../../components/tareas/Tareas.js'
import PlanMantenimientoPreventivos from '../../components/planmantenimientopreventivos/PlanMantenimientoPreventivos.js'
import Preventivos from '../../components/preventivos/Preventivos.js'

class Layout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			avatar: null
		}
	}
	componentDidMount() {
		this.loadStatics();
		this.loadAvatar();

	}

	componentDidUpdate() {
		//$('.nav-item-collapser').click(function(){$('body').addClass('menu-collapsed').removeClass('menu-expanded')});
	}

	loadAvatar() {
		let persona = JSON.parse(localStorage.getItem('persona'));
		let avatar = {
			className: 'user-avatar',
			backgroundImage: null,
			initials: persona.nombre.substr(0, 1).toUpperCase() + persona.apellido.substr(0, 1).toUpperCase()
		};
		if (persona && persona.foto) {
			let photoUrl = Config.get('apiUrlBase') + '/personas/foto/' + persona.foto;
			fetch(photoUrl, {
				method: 'GET',
				headers: {
					'Authorization-Token': localStorage.getItem("token")
				}
			}).then(response => {
				if (response.status === 200) {
					return response.blob();
				}
			}).then(imgBlob => {
				if (imgBlob) {
					avatar.className = 'user-avatar-image';
					avatar.backgroundImage = URL.createObjectURL(imgBlob);
					avatar.initials = null;
				}
			}).catch(() => {
				avatar.className = 'user-avatar';
			}).finally(() => {
				this.setState({
					avatar: avatar
				});
			});
		} else {
			avatar.className = 'user-avatar';
			this.setState({
				avatar: avatar
			});
		}
	}

	loadStatics() {
		document.body.className = 'vertical-layout vertical-menu 2-columns menu-collapsed fixed-navbar';
		document.body.setAttribute('data-col', '2-columns');

		const appMenuScript = document.createElement("script");
		appMenuScript.src = './ui-template/app-assets/js/core/app-menu.js';
		appMenuScript.async = true;
		document.body.appendChild(appMenuScript);
		appMenuScript.onload = () => {
			const appScript = document.createElement("script");
			appScript.src = './ui-template/app-assets/js/core/app.js';
			appScript.async = true;
			document.body.appendChild(appScript);
			appScript.onload = () => {
				const customizerScript = document.createElement("script");
				customizerScript.src = './ui-template/app-assets/js/scripts/customizer.js';
				customizerScript.async = true;
				document.body.appendChild(customizerScript);
			};
		};
	}

	render() {
		let persona = JSON.parse(localStorage.getItem('persona'));
		let nombreApellido = persona.nombre + ' ' + persona.apellido;
		let avatarInitials = this.state.avatar && this.state.avatar.initials ? this.state.avatar.initials : '';
		let avatarClassName = this.state.avatar && this.state.avatar.className ? this.state.avatar.className : '';
		let avatarStyle = this.state.avatar && this.state.avatar.backgroundImage ? {
			backgroundImage: 'url(' + this.state.avatar.backgroundImage + ')'
		} : {};

		return (
			<Router>
				<React.Fragment>
					{/* Header */}
					<nav className="header-navbar navbar-expand-md navbar navbar-with-menu navbar-without-dd-arrow fixed-top navbar-vec navbar-shadow">
						<div className="navbar-wrapper">
							<div className="navbar-header">
								<ul className="nav navbar-nav flex-row">
									<li className="nav-item mobile-menu d-md-none mr-auto">
										<a className="nav-link nav-menu-main menu-toggle hidden-xs">
											<i className="ft-menu font-large-1"></i>
										</a>
									</li>
									<li className="nav-item">
										<a className="navbar-brand" href="/">
											<img className="brand-logo" alt="VEC" src="./images/company/logo-app.png" />
											<h3 className="brand-text">
												<img className="" alt="DirecTV" src="./images/company/logo-company.png" width="180" />
											</h3>
										</a>
									</li>
									<li className="nav-item d-md-none">
										<a className="nav-link open-navbar-container" data-toggle="collapse" data-target="#navbar-mobile"><i className="la la-ellipsis-v"></i></a>
									</li>
								</ul>
							</div>
							<div className="navbar-container content">
								<div className="collapse navbar-collapse" id="navbar-mobile">
									<ul className="nav navbar-nav mr-auto float-left">
										<li className="nav-item d-none d-md-block"><a className="nav-link nav-menu-main menu-toggle hidden-xs"><i className="ft-menu"></i></a></li>
										<li className="nav-item d-none d-md-block"><a className="nav-link nav-link-expand"><i className="ficon ft-maximize"></i></a></li>
									</ul>
									<ul className="nav navbar-nav float-right">
										<li className="dropdown dropdown-user nav-item">
											<a className="dropdown-toggle nav-link dropdown-user-link" data-toggle="dropdown">
												<span className="mr-1">
													<span className="user-name text-bold-700">{nombreApellido}</span>
												</span>
												<span className="avatar avatar-online">
													<div ref="divAvatar" className={avatarClassName} style={avatarStyle}>{avatarInitials}</div>
												</span>
											</a>
											<div className="dropdown-menu dropdown-menu-right">
												{/*<a className="dropdown-item"><i className="ft-user"></i> Perfil</a>*/}
												<Link to='/cambiar-clave' className="dropdown-item"><i className="ft-lock"></i> Cambiar contraseña</Link>
												<div className="dropdown-divider"></div>
												<a className="dropdown-item" onClick={Security.logout}><i className="ft-power"></i> Cerrar Sesión</a>
											</div>
										</li>
										{/*<li className="dropdown dropdown-notification nav-item">
											<a className="nav-link nav-link-label" data-toggle="dropdown"><i className="ficon ft-bell"></i>
												<span className="badge badge-pill badge-default badge-danger badge-default badge-up badge-glow">5</span>
											</a>
											<ul className="dropdown-menu dropdown-menu-media dropdown-menu-right">
												<li className="dropdown-menu-header">
													<h6 className="dropdown-header m-0">
													<span className="grey darken-2">Notifications</span>
													</h6>
													<span className="notification-tag badge badge-default badge-danger float-right m-0">5 New</span>
												</li>
												<li className="scrollable-container media-list w-100">
													<a>
														<div className="media">
															<div className="media-left align-self-center"><i className="ft-plus-square icon-bg-circle bg-cyan"></i></div>
															<div className="media-body">
																<h6 className="media-heading">You have new order!</h6>
																<p className="notification-text font-small-3 text-muted">Lorem ipsum dolor sit amet, consectetuer elit.</p>
																<small>
																<time className="media-meta text-muted" dateTime="2015-06-11T18:29:20+08:00">30 minutes ago</time>
																</small>
															</div>
														</div>
													</a>
													<a>
														<div className="media">
															<div className="media-left align-self-center"><i className="ft-download-cloud icon-bg-circle bg-red bg-darken-1"></i></div>
															<div className="media-body">
																<h6 className="media-heading red darken-1">99% Server load</h6>
																<p className="notification-text font-small-3 text-muted">Aliquam tincidunt mauris eu risus.</p>
																<small>
																<time className="media-meta text-muted" dateTime="2015-06-11T18:29:20+08:00">Five hour ago</time>
																</small>
															</div>
														</div>
													</a>
													<a>
														<div className="media">
															<div className="media-left align-self-center"><i className="ft-alert-triangle icon-bg-circle bg-yellow bg-darken-3"></i></div>
															<div className="media-body">
																<h6 className="media-heading yellow darken-3">Warning notifixation</h6>
																<p className="notification-text font-small-3 text-muted">Vestibulum auctor dapibus neque.</p>
																<small>
																<time className="media-meta text-muted" dateTime="2015-06-11T18:29:20+08:00">Today</time>
																</small>
															</div>
														</div>
													</a>
													<a>
														<div className="media">
															<div className="media-left align-self-center"><i className="ft-check-circle icon-bg-circle bg-cyan"></i></div>
															<div className="media-body">
																<h6 className="media-heading">Complete the task</h6>
																<small>
																<time className="media-meta text-muted" dateTime="2015-06-11T18:29:20+08:00">Last week</time>
																</small>
															</div>
														</div>
													</a>
													<a>
														<div className="media">
															<div className="media-left align-self-center"><i className="ft-file icon-bg-circle bg-teal"></i></div>
															<div className="media-body">
																<h6 className="media-heading">Generate monthly report</h6>
																<small>
																<time className="media-meta text-muted" dateTime="2015-06-11T18:29:20+08:00">Last month</time>
																</small>
															</div>
														</div>
													</a>
												</li>
												<li className="dropdown-menu-footer"><a className="dropdown-item text-muted text-center">Read all notifications</a></li>
											</ul>
										</li>*/}
									</ul>
								</div>
							</div>
						</div>
					</nav>

					{/* Menu */}
					<div className="main-menu menu-fixed menu-vec menu-accordion menu-shadow " data-scroll-to-active="true">
						<div className="main-menu-content">
							<ul className="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
								{Security.renderIfHasAnyPermission([
									'DASHBOARD_OPERATIVO_VISUALIZAR',
									'DASHBOARD_COMERCIAL_VISUALIZAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-bar-chart"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Dashboards</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasAnyPermission('DASHBOARD_OPERATIVO_VISUALIZAR', (
										<li>
											<Link to='/dashboardOperativo'>Operativo</Link>
										</li>
										))}
										{Security.renderIfHasAnyPermission('DASHBOARD_COMERCIAL_VISUALIZAR', (
										<li>
											<Link to='#'>Económico<span className="badge badge badge-info float-right">Próx.</span></Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'TICKETS_LISTAR',
									'MANTENIMIENTOS_CORRECTIVOS_CREAR',
									'MANTENIMIENTOS_PREVENTIVOS_LISTAR',
									'VENCIMIENTOS_LISTAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-wrench"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Mantenimiento</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasPermission('TICKETS_LISTAR', (
										<li className="nav-item-collapser">
											<Link to='/tickets'>Tickets</Link>
										</li>
										))}
										{Security.renderIfHasPermission('MANTENIMIENTOS_CORRECTIVOS_CREAR', (
										<li>
											<Link to='/correctivos/add'>Correctivos</Link>
										</li>
										))}
										{Security.renderIfHasPermission('MANTENIMIENTOS_PREVENTIVOS_LISTAR', (
										<li>
											<Link to='/preventivos'>Preventivos</Link>
										</li>
										))}
										{Security.renderIfHasPermission('VENCIMIENTOS_LISTAR', (
										<li>
											<Link to='/vencimientos'>Vencimientos</Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'MOVILES_LISTAR',
									'MARCAS_LISTAR',
									'MODELOS_LISTAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-car"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Móviles</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasPermission('MOVILES_LISTAR', (
										<li>
											<Link to='/moviles'>Móviles</Link>
										</li>
										))}
										{Security.renderIfHasPermission('MARCAS_LISTAR', (
										<li>
											<Link to='/marcas'>Marcas</Link>
										</li>
										))}
										{Security.renderIfHasPermission('MODELOS_LISTAR', (
										<li>
											<Link to='/modelos'>Modelos</Link>
										</li>
										))}
										{Security.renderIfHasPermission('MODELO_TIPOS_LISTAR', (
										<li>
											<Link to='/modelotipos'>Tipos de Modelo</Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'PERSONAS_LISTAR',
									'BASES_LISTAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-user"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Recursos</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasPermission('PERSONAS_LISTAR', (
										<li>
											<Link to='/personas'>Personas y Usuarios</Link>
										</li>
										))}
										{Security.renderIfHasPermission('BASES_LISTAR', (
										<li>
											<Link to='/bases'>Bases</Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'GERENIADORES_LISTAR',
									'TALLERES_LISTAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-industry"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Proveedores</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasPermission('GERENIADORES_LISTAR', (
										<li>
											<Link to='/gerenciadores'>Gerenciadores</Link>
										</li>
										))}
										{Security.renderIfHasPermission('TALLERES_LISTAR', (
										<li>
											<Link to='/talleres'>Talleres</Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'REGIONES_LISTAR',
									'SUBREGIONES_LISTAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-map"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Localización</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasPermission('REGIONES_LISTAR', (
										<li>
											<Link to='/regiones'>Regiones</Link>
										</li>
										))}
										{Security.renderIfHasPermission('SUBREGIONES_LISTAR', (
										<li>
											<Link to='/subRegiones'>Subregiones</Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'CENTRO_COSTOS_LISTAR',
									'CENTRO_BENEFICIOS_LISTAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-folder-o"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Divisiones</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasPermission('CENTRO_COSTOS_LISTAR', (
										<li>
											<Link to='/centrosCostos'>Centros de Costos</Link>
										</li>
										))}
										{Security.renderIfHasPermission('CENTRO_BENEFICIOS_LISTAR', (
										<li>
											<Link to='/centrosBeneficios'>Centros de Beneficios</Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'PLANES_MANTENIMIENTO_LISTAR',
									'SERVICIOS_LISTAR',
									'TAREAS_LISTAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-cog"></i>
										<span className="menu-title" data-i18n="nav.dash.main">General</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasPermission('PLANES_MANTENIMIENTO_LISTAR', (
										<li>
											<Link to='/planmantenimientopreventivos'>Planes de Mantenimiento</Link>
										</li>
										))}
										{Security.renderIfHasPermission('SERVICIOS_LISTAR', (
										<li>
											<Link to='/servicios'>Servicios</Link>
										</li>
										))}
										{Security.renderIfHasPermission('TAREAS_LISTAR', (
										<li>
											<Link to='/tareas'>Tareas</Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasPermission('AVL_ACCEDER', (
								<li className="nav-item">
									<Link to='/avl'><i className="la la-map-marker"></i><span className="menu-title" data-i18n="nav.dash.main">AVL</span></Link>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'INFORMES_ACCEDER'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-pie-chart"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Informes</span>
									</a>
									<ul className="menu-content">
										<li>
											<Link to='#'>No Reportan</Link>
										</li>

									</ul>
								</li>
								))}
								{Security.renderIfHasAnyPermission([
									'PERFILES_LISTAR'
								], (
								<li className="nav-item">
									<a>
										<i className="la la-shield"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Seguridad</span>
									</a>
									<ul className="menu-content">
										{Security.renderIfHasPermission('PERFILES_LISTAR', (
										<li>
											<Link to='/perfiles'>Perfiles y Permisos</Link>
										</li>
										))}
									</ul>
								</li>
								))}
								{Security.renderIfHasPermission('AYUDA_ACCEDER', (
								<li className="nav-item">
									<a>
										<i className="la la-support"></i>
										<span className="menu-title" data-i18n="nav.dash.main">Ayuda</span>
									</a>
									<ul className="menu-content">
										{/*<li>
											<Link to='#'>Manual de usuario</Link>
										</li>*/}
										<li>
											<Link to='#'>Video Tutoriales</Link>
										</li>
									</ul>
								</li>
								))}
								{Security.renderIfHasPermission('REPORTAR_PROBLEMA', (
								<li className="nav-item">
									<Link to='/osticket'><i className="la la-bullhorn"></i><span className="menu-title" data-i18n="nav.dash.main">Reportar Problema</span></Link>
								</li>
								))}
							</ul>
						</div>
					</div>


					{/* Content */}

					<div className="app-content content">
						<Switch>
							<Route exact path='/' component={DashboardOperativo} />
							<Route path='/error' component={Error} />
							<Route path='/cambiar-clave' component={ChangePassword} />
							<Route path='/dashboardOperativo' component={DashboardOperativo} />
							<Route path='/perfiles' component={Perfiles} />
							<Route path='/personas' component={Personas} />
							<Route path='/moviles' component={Moviles} />
							<Route path='/bases' component={Bases} />
							<Route path='/avl' component={Avl} />
							<Route path='/moviles' component={Moviles} />
							<Route path='/avl' component={Avl} />
							<Route path='/gerenciadores' component={Gerenciadores} />
							<Route path='/bases' component={Bases} />
							<Route path='/correctivos' component={Correctivos} />
							<Route path='/tickets' component={Tickets} />
							<Route path='/osticket' component={Osticket} />
							<Route path='/talleres' component={Talleres} />
							<Route path='/regiones' component={Regiones} />
							<Route path='/subRegiones' component={SubRegiones} />
							<Route path='/marcas' component={Marcas} />
							<Route path='/modelos' component={Modelos} />
							<Route path='/modelotipos' component={ModeloTipos} />
							<Route path='/centroscostos' component={CentrosCostos} />
							<Route path='/centrosbeneficios' component={CentrosBeneficios} />
							<Route path='/vencimientos' component={Vencimientos} />
							<Route path='/servicios' component={Servicios} />
							<Route path='/tareas' component={Tareas} />
							<Route path='/planmantenimientopreventivos' component={PlanMantenimientoPreventivos} />
							<Route path='/preventivos' component={Preventivos} />
						</Switch>
					</div>

					{/* Footer */}
					<footer className="footer footer-static footer-light navbar-border navbar-shadow">
						<p className="clearfix blue-grey lighten-2 text-sm-center mb-0 px-2">
							{/*<span className="float-md-left d-block d-md-inline-block">Copyright &copy; 2018 <img className="logo-footer-ga" alt="VEC Fleet" src={LogoFooterGreen} height="15px" /> Todos los derechos reservados. </span>*/}
							<span className="float-md-left d-block d-md-inline-block">Copyright &copy; 2018 <img className="logo-footer-ga" alt="VEC Fleet" src="./images/company/logo-copyright.png" /> Todos los derechos reservados. </span>
							<span className="float-md-right d-block d-md-inline-blockd-none d-lg-block">Powered by: <img alt="VEC" src="./images/company/logo-powered-by.png" height="30px" /></span>
						</p>
					</footer>
				</React.Fragment>
			</Router>
		);
	}
}

export default Layout;
